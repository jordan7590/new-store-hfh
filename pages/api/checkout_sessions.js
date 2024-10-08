import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { billingFormData, shippingFormData, cartData, stripeShippingOptions, cartTotal, shippingCost, taxAmount, taxRate, orderNotes, appliedCoupon, discountAmount, customerID } = req.body;

      const billingData = JSON.stringify(billingFormData);
      const shippingData = JSON.stringify(shippingFormData);   
      const order_notes = JSON.stringify(orderNotes);   
      const subtotal = cartData.reduce((total, item) => total + parseFloat(item.totalPrice), 0);


      const discountRate = discountAmount / subtotal;
      
      
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
            unit_amount: Math.round(((item.totalPrice - (item.totalPrice * discountRate)) * 100 / itemQuantity)) + (((item.totalPrice - (item.totalPrice * discountRate)) * 100 / itemQuantity * taxRate) / 100),  
          },
          quantity: itemQuantity,
        };
      });

      const shippingOptions = stripeShippingOptions.map(item => {      
        return {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount:  parseInt(parseFloat(item.amount) * 100),
                currency: 'usd',
              },
              display_name: item.title,
            },
        };
      });

      const shippingforOrderCreation ={
              method_id: stripeShippingOptions[0].method_id,
              total: `"${stripeShippingOptions[0].amount}"`,
              method_title: stripeShippingOptions[0].title,
        };
      const shippingline = JSON.stringify(shippingforOrderCreation);   

 
      const cartItems = cartData.flatMap(item => {
        // Extracting sizeQuantities data and directly returning it
        return item.sizesQuantities.map(({ item_number, quantity }) => ({ item_number, quantity }));
    });


      const orderItems = JSON.stringify(cartItems);   

      const orderAmount = parseFloat(cartTotal) + parseFloat(shippingCost) + parseFloat(taxAmount);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/page/account/checkout`,
        metadata: {
          'billing': billingData, 
          'shipping': shippingData,
          'order-items': orderItems,
          'shipping_lines': shippingline,
          'order_notes' : order_notes,
          'appliedCoupon': appliedCoupon,
          'discountAmount': discountAmount,
          'subtotal': subtotal,
          'discountRate': discountRate,
          'customerID': customerID
        },
        shipping_options: shippingOptions,
       
          
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