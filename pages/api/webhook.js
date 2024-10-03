import { buffer } from "micro";
import Stripe from "stripe";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Object to store processed webhook event IDs
const processedEvents = {};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Helper function for structured logging
const log = (message, obj = {}) => {
  console.log(JSON.stringify({
    message,
    ...obj,
    timestamp: new Date().toISOString()
  }));
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      log("Received Stripe webhook");

      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"];

      // Construct event from Stripe webhook payload
      const event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
      log("Constructed Stripe event", { eventType: event.type, eventId: event.id });

      // Check if event ID has already been processed
      if (processedEvents[event.id]) {
        log("Webhook event already processed", { eventId: event.id });
        return res.status(200).json({ received: true });
      }

      // Handle the event
      if (event.type === "checkout.session.completed") {
        log("Processing checkout.session.completed event");
        
        // Extract necessary data from the event
        const session = event.data.object;
        const billingData = JSON.parse(session.metadata.billing);
        const shippingData = JSON.parse(session.metadata.shipping);
        const orderItems = JSON.parse(session.metadata["order-items"]);
        const shippingLines = JSON.parse(session.metadata.shipping_lines);
        const orderNotes = JSON.parse(session.metadata.order_notes);

        log("Extracted data from session", { 
          billingName: `${billingData.first_name} ${billingData.last_name}`,
          shippingName: `${shippingData.first_name} ${shippingData.last_name}`,
          itemCount: orderItems.length,
          hasOrderNotes: !!orderNotes
        });

        // Construct order data for WooCommerce
        const orderData = {
          payment_method: "Stripe",
          payment_method_title: "Credit Card",
          set_paid: true,
          billing: {
            first_name: billingData.first_name,
            last_name: billingData.last_name,
            address_1: billingData.address1,
            address_2: billingData.address2,
            city: billingData.city,
            state: billingData.state,
            postcode: billingData.pincode,
            country: "US", // Assuming the country is always US
            email: billingData.email,
            phone: billingData.phone
          },
          shipping: {
            first_name: shippingData.first_name,
            last_name: shippingData.last_name,
            address_1: shippingData.address1,
            address_2: shippingData.address2,
            city: shippingData.city,
            state: shippingData.state,
            postcode: shippingData.pincode,
            country: "US", // Assuming the country is always US
          },
          line_items: orderItems.map(item => ({
            product_id: item.item_number, // item_number corresponds to the product_id
            quantity: item.quantity
          })),
          shipping_lines: [
            {
              method_id: shippingLines.method_id,
              method_title: shippingLines.method_title,
              total: shippingLines.total
            }
          ]
        };

        log("Attempting to create WooCommerce order");
        // Create order in WooCommerce using Axios
        try {
          const createdOrder = await axios.post(
            `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/orders`,
            orderData,
            {
              auth: {
                username: process.env.WOOCOMMERCE_CONSUMER_KEY,
                password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
              },
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        
          log("Order created in WooCommerce", { 
            orderId: createdOrder.data.id,
            orderStatus: createdOrder.data.status
          });
        
          // Create order note
          if (orderNotes) {
            log("Attempting to create order note", { orderId: createdOrder.data.id });
            const orderId = createdOrder.data.id;
            const noteData = {
              note: orderNotes
            };
        
            try {
              const createdNote = await axios.post(
                `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}/notes`,
                noteData,
                {
                  params: {
                    consumer_key: process.env.WOOCOMMERCE_CONSUMER_KEY,
                    consumer_secret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
                  },
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              log("Order note created successfully", { noteId: createdNote.data.id });
            } catch (error) {
              log("Error creating order note", { 
                error: error.message, 
                responseData: error.response ? JSON.stringify(error.response.data) : null,
                stack: error.stack
              });
            }
          } else {
            log("No order notes to create");
          }
        } catch (error) {
          log("Error creating WooCommerce order", { 
            error: error.message, 
            responseData: error.response ? JSON.stringify(error.response.data) : null,
            stack: error.stack
          });
        }
        
        log("Webhook processing completed");
        

        res.status(200).json({ received: true });
        processedEvents[event.id] = true; // Mark event as processed
        log("Event processed successfully", { eventId: event.id });
      } else {
        log("Unhandled event type", { eventType: event.type });
        res.status(200).json({ received: true });
      }
    } catch (err) {
      log("Error handling Stripe webhook", { error: err.message });
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    log("Invalid request method", { method: req.method });
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}