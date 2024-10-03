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

async function processOrder(session) {
  console.log("DEBUG: Processing order asynchronously");
  
  const billingData = JSON.parse(session.metadata.billing);
  const shippingData = JSON.parse(session.metadata.shipping);
  const orderItems = JSON.parse(session.metadata["order-items"]);
  const shippingLines = JSON.parse(session.metadata.shipping_lines);
  const orderNotes = session.metadata.order_notes ? JSON.parse(session.metadata.order_notes) : "Order created via Stripe";

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
      country: "US",
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
      country: "US",
    },
    line_items: orderItems.map(item => ({
      product_id: item.item_number,
      quantity: item.quantity
    })),
    shipping_lines: [
      {
        method_id: shippingLines.method_id,
        method_title: shippingLines.method_title,
        total: shippingLines.total.replace(/^"|"$/g, '')
      }
    ]
  };

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

    console.log("DEBUG: Order created:", createdOrder.data.id);

    if (orderNotes) {
      await axios.post(
        `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${createdOrder.data.id}/notes`,
        { note: orderNotes },
        {
          auth: {
            username: process.env.WOOCOMMERCE_CONSUMER_KEY,
            password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
          },
        }
      );
      console.log("DEBUG: Order note created");
    }
  } catch (error) {
    console.error("DEBUG: Error processing order:", error.message);
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        
        // Acknowledge receipt of the event immediately
        res.status(200).json({ received: true });
        
        // Process the order asynchronously
        processOrder(session).catch(console.error);
      } else {
        res.status(200).json({ received: true });
      }
    } catch (err) {
      console.error("DEBUG: Error handling Stripe webhook:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}