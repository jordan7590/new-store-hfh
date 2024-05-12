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
      try {
        // Extract necessary data from the event
        const session = event.data.object;
        const lineItems = session.display_items;

        // Construct order data for WooCommerce
        const orderData = {
          payment_method: "stripe",
          payment_method_title: "Card",
          set_paid: true,
          billing: {
            first_name: session.customer_details.name.split(" ")[0], // Extract first name from customer name
            last_name: session.customer_details.name.split(" ")[1], // Extract last name from customer name
            email: session.customer_details.email,
          },
          line_items: lineItems.map((item) => ({
            product_id: item.custom.name, // Assuming your product ID is stored in the custom attribute of the item
            quantity: item.quantity,
          })),
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
      } catch (err) {
        console.error("Error creating order in WooCommerce:", err.message);
        res.status(500).send("Error creating order in WooCommerce");
      }
    } else {
      res.status(200).json({ received: true });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
