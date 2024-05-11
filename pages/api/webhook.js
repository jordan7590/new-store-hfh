import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const event = req.body;

  // Ensure that the request body is received as a string or a Buffer
  const requestBody = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;

  // Verify the event by fetching it from Stripe
  try {
    const stripeEvent = await stripe.webhooks.constructEvent(
      requestBody,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    if (stripeEvent.type === "checkout.session.completed") {
      // Payment successfully completed
      const session = stripeEvent.data.object;

      // Assuming your form data includes information about the purchased items
      const formData = req.body.formData;

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

      // Perform other actions after successful order creation if needed

      res.status(200).json({ received: true });
    }
  } catch (err) {
    console.error("Error handling webhook event:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
