import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { billingFormData, shippingFormData, cartData } = req.body;

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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/`,
      });


       
      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      res.status(500).json({ error: "Error creating checkout session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}