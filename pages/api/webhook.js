import { buffer } from "micro";
import Stripe from "stripe";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const processedEvents = {};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

async function createWooCommerceOrder(orderData) {
  console.log("DEBUG: Entering createWooCommerceOrder function");
  console.log("DEBUG: orderData:", JSON.stringify(orderData));

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

    console.log("DEBUG: Order created. Response:", JSON.stringify(createdOrder.data));

    return createdOrder.data;
  } catch (error) {
    console.error("DEBUG: Error creating order:", error.response ? JSON.stringify(error.response.data) : error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  console.log("DEBUG: Webhook handler triggered");
  if (req.method === "POST") {
    try {
      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"];

      console.log("DEBUG: Constructing Stripe event");
      const event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);

      console.log("DEBUG: Stripe event type:", event.type);

      if (processedEvents[event.id]) {
        console.log("DEBUG: Webhook event already processed:", event.id);
        return res.status(200).json({ received: true });
      }

      if (event.type === "checkout.session.completed") {
        console.log("DEBUG: Processing checkout.session.completed event");
        const session = event.data.object;

        console.log("DEBUG: Session metadata:", JSON.stringify(session.metadata));

        const billingData = JSON.parse(session.metadata.billing);
        const shippingData = JSON.parse(session.metadata.shipping);
        const orderItems = JSON.parse(session.metadata["order-items"]);
        const shippingLines = JSON.parse(session.metadata.shipping_lines);
        const orderNotes = session.metadata.order_notes.replace(/^"|"$/g, '');
        const appliedCoupon = session.metadata.appliedCoupon.replace(/^"|"$/g, '');
        const discountAmount = session.metadata.discountAmount.replace(/^"|"$/g, '');
        const customerID = session.metadata.customerID.replace(/^"|"$/g, '');

        console.log("DEBUG: Parsed Order Notes:", orderNotes);

        const orderData = {
          payment_method: "Stripe",
          payment_method_title: "Credit Card",
          set_paid: true,
          customer_id: customerID,
          customer_note: orderNotes,
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
              total: shippingLines.total
            }
          ],
          coupon_lines: appliedCoupon ? [
            {
              code: appliedCoupon,
              discount: discountAmount
            }
          ] : [],
          meta_data: [
            {
              key: "stripe_session_id",
              value: session.id
            }
          ]
        };

        try {
          console.log("DEBUG: Calling createWooCommerceOrder");
          const createdOrder = await createWooCommerceOrder(orderData);
          console.log("DEBUG: Order created in WooCommerce:", JSON.stringify(createdOrder));
          processedEvents[event.id] = true;
          res.status(200).json({ received: true });
        } catch (error) {
          console.error("DEBUG: Error creating WooCommerce order:", error);
          res.status(500).json({ error: "Error creating WooCommerce order" });
        }
      } else {
        console.log("DEBUG: Unhandled event type");
        res.status(200).json({ received: true });
      }
    } catch (err) {
      console.error("DEBUG: Error handling Stripe webhook:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    console.log("DEBUG: Method not allowed");
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}