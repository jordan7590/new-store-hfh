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

      const { billingFormData, shippingFormData, cartData } = req.body;

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
        // const lineItems = session.display_items;

             // Construct line items based on cart data
      const lineItems = cartData.map(item => {
        const itemQuantity = item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ?
          item.sizesQuantities.reduce((totalQty, sizeQuantity) => totalQty + sizeQuantity.quantity, 0) :
          0;
      
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.totalPrice * 100 / itemQuantity),  
          },
          quantity: itemQuantity,
        };
      });


        // Example: Logging the received data
      // console.log('Received Billing Form Data:', billingFormData);
      // console.log('Received Shipping Form Data:', shippingFormData);
      // console.log('Received Cart Data:', cartData);
         // Construct order data for WooCommerce
         const orderData = {
            payment_method: "bacs",
            payment_method_title: "Direct Bank Transfer",
            set_paid: true,
            billing: {
              first_name: "Ronalld",
              last_name: "Behera",
              address_1: "969 Market",
              address_2: "",
              city: "San Francisco",
              state: "CA",
              postcode: "94103",
              country: "US",
              email: "john.doe@example.com",
              phone: "(555) 555-5555"
            },
            shipping: {
              first_name: "Ronalld",
              last_name: "Behera",
              address_1: "969 Market",
              address_2: "",
              city: "San Francisco",
              state: "CA",
              postcode: "94103",
              country: "US"
            },
            line_items:lineItems,
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
