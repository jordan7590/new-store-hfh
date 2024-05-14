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

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {

      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"];

      // Construct event from Stripe webhook payload
      const event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);

      // Check if event ID has already been processed
      if (processedEvents[event.id]) {
        console.log("Webhook event already processed:", event.id);
        return res.status(200).json({ received: true });
      }

      // Handle the event
      if (event.type === "checkout.session.completed") {
        // Extract necessary data from the event
        const session = event.data.object;
        const lineItems = session.line_items;

        const billingData = JSON.parse(session.metadata.billing);
        const shippingData = JSON.parse(session.metadata.shipping);
        const orderItems = JSON.parse(session.metadata["order-items"]);
        
         // Construct order data for WooCommerce
         const orderData ={
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
          product_id: item.item_number, //  item_number corresponds to the product_id
          quantity: item.quantity
        })),
         shipping_lines: [
           {
             method_id: "flat_rate",
             method_title: "Flat Rate",
             total: "10.00"
           }
         ]
       };

        // Create order in WooCommerce using Axios
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

        console.log("Order created in WooCommerce:", createdOrder.data);
        res.status(200).json({ received: true });
        processedEvents[event.id] = true; // Mark event as processed
      } else {
        res.status(200).json({ received: true });
      }
    } catch (err) {
      console.error("Error handling Stripe webhook:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
