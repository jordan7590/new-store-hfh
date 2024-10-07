import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useState } from "react"; // Import useState hook

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutButton = ({
  billingFormData,
  shippingFormData,
  cartData,
  stripeShippingOptions,
  taxRate,
  billingFormValid,
  shippingFormValid,
  shippingAvailable,
  orderNotes,
  appliedCoupon,
  discountAmount,
}) => {
  const router = useRouter();
  const [billingFormErrors, setBillingFormErrors] = useState({}); // State to store billing form errors
  const [shippingFormErrors, setShippingFormErrors] = useState({}); // State to store shipping form errors

  const handleCheckout = async () => {
    // Validate billing form
    const billingErrors = {};
    for (const key in billingFormData) {
      if (!billingFormData[key]) {
        billingErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is a required field.`;
      }
    }
    setBillingFormErrors(billingErrors);

    // Validate shipping form
    const shippingErrors = {};
    for (const key in shippingFormData) {
      if (!shippingFormData[key]) {
        shippingErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is a required field.`;
      }
    }
    setShippingFormErrors(shippingErrors);

    if (!billingFormValid || !shippingFormValid || !shippingAvailable) {
      // If any of the conditions for disabling the button are met, return without proceeding to checkout
      return;
    }

    try {
      const stripe = await stripePromise;
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingFormData: billingFormData,
          shippingFormData: shippingFormData,
          cartData: cartData,
          stripeShippingOptions: stripeShippingOptions,
          taxRate: taxRate,
          orderNotes: orderNotes,
          appliedCoupon: appliedCoupon,
          discountAmount: discountAmount
        }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        router.push("/error");
      }
    } catch (err) {
      console.error("Error in creating checkout session:", err);
      router.push("/error");
    }
  };

  return (
    <div style={{marginTop:'50px'}}>
      <button
        onClick={handleCheckout}
        className="btn btn-solid"
        style={{ width:'100%', 
          backgroundImage: `linear-gradient(30deg, var(--theme-deafult) 100%, transparent 80%)`

        }}
        // disabled={!billingFormValid || !shippingFormValid || !shippingAvailable}
      >
        Buy Now
      </button>
      <div>
        {Object.keys(billingFormErrors).map((key) => (
          <p key={key} style={{ color: "red" }}>
            {billingFormErrors[key]}
          </p>
        ))}
        {Object.keys(shippingFormErrors).map((key) => (
          <p key={key} style={{ color: "red" }}>
            {shippingFormErrors[key]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CheckoutButton;
