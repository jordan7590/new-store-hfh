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
        const billingFormData = session.metadata.billingFormData;
        const shippingFormData = session.metadata.shippingFormData;

         // Construct order data for WooCommerce
         const orderData ={
         payment_method: "Stripe",
         payment_method_title: "Credit Card",
         set_paid: true,
         billing: billingFormData,
         shipping: shippingFormData,
         line_items: [
           {
             product_id: 93,
             quantity: 2
           },
           {
             product_id: 22,
             variation_id: 23,
             quantity: 1
           }
         ],
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
