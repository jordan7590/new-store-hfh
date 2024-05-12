import { buffer } from "micro";
import Stripe from "stripe";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      // Extract necessary data from the event
      const session = event.data.object;

      // Assuming your form data includes information about the purchased items
      const formData = session.metadata.formData;

      // Split line items into batches for processing
      const batchSize = 10; // Adjust batch size as needed
      const lineItems = session.display_items;
      const batchCount = Math.ceil(lineItems.length / batchSize);

      for (let i = 0; i < batchCount; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min((i + 1) * batchSize, lineItems.length);
        const batchLineItems = lineItems.slice(startIndex, endIndex);

        // Construct order data for WooCommerce
        const orderData = {
            payment_method: "stripe",
            payment_method_title: "Card",
            set_paid: true,
            billing: {
              first_name: "John",
              last_name: "Doe",
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
              first_name: "John",
              last_name: "Doe",
              address_1: "969 Market",
              address_2: "",
              city: "San Francisco",
              state: "CA",
              postcode: "94103",
              country: "US"
            },
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

        try {
          // Create order in WooCommerce using Axios
          const createdOrder = await axios.post(
            `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/orders`,
            orderData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')}`
              }
            }
          );

          console.log("Order created in WooCommerce:", createdOrder.data);
        } catch (err) {
          console.error("Error creating order in WooCommerce:", err.message);
          // Handle error gracefully
        }
      }

      res.status(200).json({ received: true });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
