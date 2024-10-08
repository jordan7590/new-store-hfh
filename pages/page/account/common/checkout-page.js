import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Row, Col, Input, Button } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import paypal from "../../../../public/assets/images/paypal.png";
import { PayPalButton } from "react-paypal-button-v2";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutButton from "../../../../components/checkout/CheckoutButton";

const stripePromise = loadStripe("pk_test_I8XFeUwEEFSEVuNZm11k8btS"); // Replace with your actual Stripe publishable key

const CheckoutPage = ({ customerId }) => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const [obj, setObj] = useState({});
  const [payment, setPayment] = useState("cod");
  const [billingFormData, setBillingFormData] = useState({
    country: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [shippingFormData, setShippingFormData] = useState({
    country: "",
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false); // State to manage whether to ship to a different address
  const [shippingAvailable, setShippingAvailable] = useState(true); // State to track shipping availability
  const [shippingMethods, setShippingMethods] = useState([]); // State to store available shipping methods
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to store error
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    shippingMethods[0]?.id || null
  );
  const [shippingCost, setShippingCost] = useState(0); // State to store shipping cost
  const [stripeShippingOptions, setStripeShippingOptions] = useState(0); // State to store shipping cost
  const [orderTotal, setOrderTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(""); // State to store tax rate
  const [taxAmount, setTaxAmount] = useState(0); // State to store tax amount
  const [billingFormValid, setBillingFormValid] = useState(false);
  const [shippingFormValid, setShippingFormValid] = useState(false);
  const [billingFormErrors, setBillingFormErrors] = useState({});
  const [shippingFormErrors, setShippingFormErrors] = useState({});
  const [orderNotes, setOrderNotes] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // initialise the hook
  const router = useRouter();

  const handleOrderNotesChange = (event) => {
    setOrderNotes(event.target.value);
  };

  const handleBillingInputChange = (event) => {
    const { name, value } = event.target;
    const updatedBillingFormData = { ...billingFormData, [name]: value };
    setBillingFormData(updatedBillingFormData);

    if (!shipToDifferentAddress) {
      // If shipToDifferentAddress is false, copy billing data to shipping data
      const updatedShippingFormData = { ...shippingFormData, [name]: value };
      // Remove email and phone fields from shipping data
      if (name !== "email" && name !== "phone") {
        setShippingFormData(updatedShippingFormData);
        setShippingFormValid(true);
      }
    }
    const isFormValidBilling = Object.keys(updatedBillingFormData).every(
      (fieldName) => updatedBillingFormData[fieldName].trim() !== ""
    );
    setBillingFormValid(isFormValidBilling);
    setBillingFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? "Field is required" : "",
    }));
  };

  const handleShippingInputChange = (event) => {
    const { name, value } = event.target;
    console.log("Shipping Form Data:", { ...shippingFormData, [name]: value });
    setShippingFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      // Check if all fields in the updated form data are filled
      const isFormValidShipping = Object.keys(updatedFormData).every(
        (fieldName) => updatedFormData[fieldName].trim() !== ""
      );

      setShippingFormValid(isFormValidShipping);

      setShippingFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim() === "" ? "Field is required" : "",
      }));

      return updatedFormData;
    });
  };

  // only for test, delete latter
  const orderItems = cartItems.flatMap((item) => {
    // Extracting sizeQuantities data and directly returning it
    return item.sizesQuantities.map(({ item_number, quantity }) => ({
      item_number,
      quantity,
    }));
  });

  useEffect(() => {
    const fetchShippingZones = async () => {
      try {
        const response = await fetch(
          "https://hfh.tonserve.com/wp-json/wc/v3/shipping/zones/2/locations?consumer_key=ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2&consumer_secret=cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shipping zones");
        }
        const data = await response.json();
        const country = shippingFormData.country;
        const postcode = shippingFormData.pincode;

        console.log("Country:", country, "Postcode:", postcode);

        const match = data.find(
          (location) => location.code === country || location.code === postcode
        );

        console.log("Matching location:", match);

        if (match) {
          setShippingAvailable(true);
          // If shipping is available, fetch shipping methods
          console.log("Shipping available. Fetching shipping methods...");
          const methodsResponse = await fetchShippingMethods();
          console.log("Methods response:", methodsResponse);

          // Filter shipping methods based on conditions
          const filteredMethods = methodsResponse.filter((method) => {
            if (method.method_id === "free_shipping") {
              // Check if free shipping has a minimum amount set
              if (
                method.settings &&
                method.settings.min_amount &&
                cartTotal >= method.settings.min_amount.value
              ) {
                method.price = 0; // Set price for free shipping as 0
                return true; // Include free shipping method if the cart total meets the minimum amount
              }
            } else if (method.method_id === "flat_rate") {
              // Set price for flat rate shipping
              method.price = method.settings.cost.value;
              return true;
            }
            return false;
          });

          // Set the filtered shipping methods in state
          setShippingMethods(filteredMethods);

          console.log("filtered Methods:", filteredMethods);

          setLoading(false);
        } else {
          console.log("Shipping not available for the provided location.");
          setShippingAvailable(false);
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (Object.keys(shippingFormData).length > 0) {
      console.log("Shipping form data:", shippingFormData);
      fetchShippingZones();
    }
  }, [shippingFormData]);

  const fetchShippingMethods = async () => {
    try {
      console.log("Fetching shipping methods...");
      const response = await fetch(
        "https://hfh.tonserve.com/wp-json/wc/v3/shipping/zones/2/methods?consumer_key=ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2&consumer_secret=cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shipping methods");
      }
      const data = await response.json();
      console.log("Shipping methods data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
      return [];
    }
  };

  // Function to handle selection of shipping method
  const handleShippingMethodChange = (event) => {
    const { value } = event.target;
    setSelectedShippingMethod(value);
    console.log("Selected shipping method:", value);

    // Convert value to a number
    const selectedValue = parseInt(value, 10);

    // Find the selected shipping method from the shippingMethods array
    const selectedMethod = shippingMethods.find(
      (method) => method.id === selectedValue
    );

    if (selectedMethod) {
      // Update the shipping cost with the price of the selected method
      setShippingCost(selectedMethod.price);
      console.log("shippingCost:", shippingCost);

      // Convert selectedMethod to an array
      const selectedMethodArray = [
        {
          method_id: selectedMethod.method_id,
          title: selectedMethod.title,
          amount: selectedMethod.price,
        },
      ];
      // Call setStripeShippingOptions function with selectedMethodArray as parameter
      setStripeShippingOptions(selectedMethodArray);
      console.log("StripeShippingOptions:", stripeShippingOptions);
    }
  };

  // const setStateFromInput = (event) => {
  //   obj[event.target.name] = event.target.value;
  //   setObj(obj);
  // };

  // Function to calculate tax based on billing address and cart total
  // Updated calculateTax function
  const calculateTax = async () => {
    try {
      const response = await fetch(
        `https://hfh.tonserve.com/wp-json/wc/v3/taxes?consumer_key=ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2&consumer_secret=cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch taxes");
      }
      const taxes = await response.json();

      const billingCountry = billingFormData.country || "";
      const billingState = billingFormData.state || "";
      const billingPostcode = billingFormData.pincode || "";
      const billingCity = billingFormData.city || "";

      let matchingTax = taxes.find((tax) => {
        return (
          (tax.country === billingCountry || tax.country === "") &&
          (tax.state === billingState || tax.state === "") &&
          (tax.postcode === billingPostcode || tax.postcode === "") &&
          (tax.city === billingCity || tax.city === "")
        );
      });

      if (matchingTax) {
        const taxRate = parseFloat(matchingTax.rate);
        setTaxRate(taxRate);

        // Calculate tax on the discounted cart total
        const discountedTotal =
          parseFloat(cartTotal) - parseFloat(discountAmount);
        const tax = (discountedTotal * taxRate) / 100;
        setTaxAmount(tax);
        console.log("tax rate", taxRate);
        console.log("tax amount", tax);
      } else {
        setTaxRate("");
        setTaxAmount(0);
      }
    } catch (error) {
      console.error("Error calculating tax:", error);
    }
  };

  // Update useEffect to recalculate tax when discount changes
  useEffect(() => {
    if (Object.keys(billingFormData).length > 0) {
      calculateTax();
    }
  }, [billingFormData, discountAmount]); // Add discountAmount as a dependency

  // Update order total calculation
  useEffect(() => {
    const total =
      parseFloat(cartTotal) -
      parseFloat(discountAmount) +
      parseFloat(shippingCost) +
      parseFloat(taxAmount);
    setOrderTotal(total);
  }, [cartTotal, shippingCost, taxAmount, discountAmount]);

  useEffect(() => {
    // Check if shipping methods are available and not loading
    if (shippingMethods.length > 0 && !loading) {
      // Select the first shipping method
      const firstShippingMethod = shippingMethods[0];
      setSelectedShippingMethod(firstShippingMethod.id); // Select the first shipping method
      handleShippingMethodChange({ target: { value: firstShippingMethod.id } }); // Trigger the handleShippingMethodChange function
    }
  }, [shippingMethods, loading]);

  const validateCoupon = async (code) => {
    try {
      const response = await fetch(
        `https://hfh.tonserve.com/wp-json/wc/v3/coupons?code=${code}&consumer_key=ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2&consumer_secret=cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return data[0];
      } else {
        setCouponError("Invalid coupon code");
        return null;
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponError("Error validating coupon");
      return null;
    }
  };

  const handleApplyCoupon = async () => {
    setCouponError("");

    // Check if the coupon code is empty
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const coupon = await validateCoupon(couponCode);
    if (!coupon) return;

    const currentDate = new Date();
    const expiryDate = new Date(coupon.date_expires);

    // Check expiration
    if (expiryDate < currentDate) {
      setCouponError("This coupon has expired");
      return;
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      setCouponError("This coupon has reached its usage limit");
      return;
    }

    // Check usage limit per user
    if (coupon.usage_limit_per_user) {
      // You'll need to implement a way to check the current user's usage
      // This is just a placeholder
      const currentUserUsage = 0;
      if (currentUserUsage >= coupon.usage_limit_per_user) {
        setCouponError("You have reached the usage limit for this coupon");
        return;
      }
    }

    // Check minimum spend
    if (
      coupon.minimum_amount &&
      parseFloat(cartTotal) < parseFloat(coupon.minimum_amount)
    ) {
      setCouponError(
        `Order must be at least ${symbol}${coupon.minimum_amount} to use this coupon`
      );
      return;
    }

    // Check maximum spend
    if (
      coupon.maximum_amount &&
      parseFloat(coupon.maximum_amount) !== 0 &&
      parseFloat(cartTotal) > parseFloat(coupon.maximum_amount)
    ) {
      setCouponError(
        `Order must be no more than ${symbol}${coupon.maximum_amount} to use this coupon`
      );
      return;
    }

    // Check if coupon excludes sale items
    if (coupon.exclude_sale_items) {
      const hasSaleItem = cartItems.some((item) => item.onSale);
      if (hasSaleItem) {
        setCouponError("This coupon cannot be used with sale items");
        return;
      }
    }

    // Check excluded products and categories
    const excludedProductIds = new Set(coupon.excluded_product_ids);
    const excludedCategoryIds = new Set(coupon.excluded_product_categories);
    const hasExcludedItem = cartItems.some(
      (item) =>
        excludedProductIds.has(item.id) ||
        item.categories.some((cat) => excludedCategoryIds.has(cat.id))
    );
    if (hasExcludedItem) {
      setCouponError("This coupon cannot be used with some items in your cart");
      return;
    }

    // Check if coupon applies to specific products or categories
    if (coupon.product_ids.length > 0 || coupon.product_categories.length > 0) {
      const applicableProductIds = new Set(coupon.product_ids);
      const applicableCategoryIds = new Set(coupon.product_categories);
      const hasApplicableItem = cartItems.some(
        (item) =>
          applicableProductIds.has(item.id) ||
          item.categories.some((cat) => applicableCategoryIds.has(cat.id))
      );
      if (!hasApplicableItem) {
        setCouponError("This coupon does not apply to any items in your cart");
        return;
      }
    }

    // Apply the coupon
    setAppliedCoupon(coupon);

    calculateDiscount(coupon);
  };

  useEffect(() => {
    if (appliedCoupon) {
      console.log("Updated applied coupon:", appliedCoupon);
    }
  }, [appliedCoupon]);

  const calculateDiscount = (coupon) => {
    let discount = 0;
    switch (coupon.discount_type) {
      case "percent":
        discount = (parseFloat(cartTotal) * parseFloat(coupon.amount)) / 100;
        break;
      case "fixed_cart":
        discount = Math.min(parseFloat(coupon.amount), parseFloat(cartTotal));
        break;
      case "fixed_product":
        discount = cartItems.reduce((total, item) => {
          if (coupon.product_ids.includes(item.id)) {
            return total + parseFloat(coupon.amount) * item.quantity;
          }
          return total;
        }, 0);
        break;
      // Add handling for store credit if needed
      default:
        console.error("Unknown discount type");
    }
    setDiscountAmount(discount);

    // Handle free shipping

    // Handle shipping methods
    if (coupon.free_shipping) {
      const freeShippingMethod = {
        id: "free_shipping_coupon",
        method_id: "free_shipping",
        title: "Free Shipping (Coupon)",
        price: "0",
      };

      setShippingCost(0);
      setShippingMethods([freeShippingMethod]);
      setSelectedShippingMethod(freeShippingMethod.id);
      setStripeShippingOptions([
        {
          method_id: freeShippingMethod.method_id,
          title: freeShippingMethod.title,
          amount: 0,
        },
      ]);
    } else {
      // If the coupon doesn't provide free shipping, keep the existing shipping methods
      fetchShippingMethods().then((methods) => {
        const filteredMethods = methods.filter((method) => {
          if (method.method_id === "free_shipping") {
            if (
              method.settings &&
              method.settings.min_amount &&
              cartTotal >= method.settings.min_amount.value
            ) {
              method.price = 0;
              return true;
            }
          } else if (method.method_id === "flat_rate") {
            method.price = method.settings.cost.value;
            return true;
          }
          return false;
        });

        setShippingMethods(filteredMethods);
        if (filteredMethods.length > 0) {
          handleShippingMethodChange({
            target: { value: filteredMethods[0].id },
          });
        }
      });
    }
  };

  const removeCoupon = async () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setCouponError("");

    // Reset shipping methods to default
    const methods = await fetchShippingMethods();
    const filteredMethods = methods.filter((method) => {
      if (method.method_id === "free_shipping") {
        if (
          method.settings &&
          method.settings.min_amount &&
          cartTotal >= method.settings.min_amount.value
        ) {
          method.price = 0;
          return true;
        }
      } else if (method.method_id === "flat_rate") {
        method.price = method.settings.cost.value;
        return true;
      }
      return false;
    });

    setShippingMethods(filteredMethods);

    // Select the first available shipping method
    if (filteredMethods.length > 0) {
      setSelectedShippingMethod(filteredMethods[0].id);
      handleShippingMethodChange({ target: { value: filteredMethods[0].id } });
    }
  };

  // Update order total calculation
  useEffect(() => {
    const subtotal = parseFloat(cartTotal) || 0;
    const discount = parseFloat(discountAmount) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const tax = parseFloat(taxAmount) || 0;

    const total = subtotal - discount + shipping + tax;
    setOrderTotal(Math.max(0, Math.round(total * 100) / 100)); // Ensure non-negative and round to 2 decimal places
  }, [cartTotal, discountAmount, shippingCost, taxAmount]);

  return (
    <section className="section-b-space">
      <Container>
        <div className="checkout-page">
          <div className="checkout-form">
            <Row>
              <Col lg="6" sm="12" xs="12">
                <Form>
                  <div className="checkout-title">
                    <h3>Billing Details</h3>
                  </div>
                  <div className="row check-out">
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">First Name</div>
                      <input
                        type="text"
                        className={`${errors.first_name ? "error_border" : ""}`}
                        name="first_name"
                        onChange={handleBillingInputChange}
                      />

                      {billingFormErrors.first_name && (
                        <p style={{ color: "red" }}>
                          {billingFormErrors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Last Name</div>
                      <input
                        type="text"
                        className={`${errors.last_name ? "error_border" : ""}`}
                        name="last_name"
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Phone</div>
                      <input
                        type="text"
                        name="phone"
                        className={`${errors.phone ? "error_border" : ""}`}
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Email Address</div>
                      <input
                        className={`${errors.email ? "error_border" : ""}`}
                        type="text"
                        name="email"
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Country</div>
                      <select
                        name="country"
                        onChange={handleBillingInputChange}
                      >
                        <option>Select</option>
                        <option>US</option>
                        <option>Canada</option>
                      </select>
                      {billingFormErrors.country && (
                        <span className="error">
                          {billingFormErrors.country}
                        </span>
                      )}
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Address 1</div>
                      <input
                        className={`${errors.address1 ? "error_border" : ""}`}
                        type="text"
                        name="address1"
                        onChange={handleBillingInputChange}
                        placeholder="House number & street name"
                      />
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Address 2</div>
                      <input
                        className={`${errors.address2 ? "error_border" : ""}`}
                        type="text"
                        name="address2"
                        onChange={handleBillingInputChange}
                        placeholder="Apartment, suite, unit, etc (optional) "
                      />
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">City</div>
                      <input
                        type="text"
                        className={`${errors.city ? "error_border" : ""}`}
                        name="city"
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">State</div>
                      <input
                        type="text"
                        className={`${errors.state ? "error_border" : ""}`}
                        name="state"
                        onChange={handleBillingInputChange}
                      />
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">Postal Code</div>
                      <input
                        type="text"
                        name="pincode"
                        onChange={handleBillingInputChange}
                        className={`${errors.pincode ? "error_border" : ""}`}
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Order Notes</div>
                      <textarea
                        name="orderNotes"
                        rows="4"
                        className="form-control"
                        onChange={handleOrderNotesChange}
                        value={orderNotes}
                        placeholder="Optional: Add any special instructions or information about your order here."
                      ></textarea>
                    </div>
                  </div>
                </Form>

                <div className="row check-out">
                  <div
                    className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    style={{ margin: "20px 0px" }}
                  >
                    <input
                      type="checkbox"
                      name="ship_to_different_address"
                      id="ship-to-different-address"
                      onChange={(e) =>
                        setShipToDifferentAddress(e.target.checked)
                      }
                    />
                    &ensp;
                    <label htmlFor="ship-to-different-address">
                      Ship to a different address?
                    </label>
                  </div>
                </div>

                {shipToDifferentAddress && (
                  <Form>
                    <div className="checkout-title">
                      <h3>Shipping Details</h3>
                    </div>
                    <div className="row check-out">
                      <div className="form-group col-md-6 col-sm-6 col-xs-12">
                        <div className="field-label">First Name</div>
                        <input
                          type="text"
                          className={`${
                            errors.first_name ? "error_border" : ""
                          }`}
                          name="first_name"
                          onChange={handleShippingInputChange}
                        />
                      </div>
                      <div className="form-group col-md-6 col-sm-6 col-xs-12">
                        <div className="field-label">Last Name</div>
                        <input
                          type="text"
                          className={`${
                            errors.last_name ? "error_border" : ""
                          }`}
                          name="last_name"
                          onChange={handleShippingInputChange}
                        />
                      </div>
                      <div className="form-group col-md-12 col-sm-12 col-xs-12">
                        <div className="field-label">Country</div>
                        <select
                          name="country"
                          onChange={handleShippingInputChange}
                        >
                          <option>Select</option>
                          <option>US</option>
                          <option>Canada</option>
                        </select>
                      </div>
                      <div className="form-group col-md-12 col-sm-12 col-xs-12">
                        <div className="field-label">Address 1</div>
                        <input
                          className={`${errors.address1 ? "error_border" : ""}`}
                          type="text"
                          name="address1"
                          onChange={handleShippingInputChange}
                          placeholder="House number & street name"
                        />
                      </div>
                      <div className="form-group col-md-12 col-sm-12 col-xs-12">
                        <div className="field-label">Address 2</div>
                        <input
                          className={`${errors.address2 ? "error_border" : ""}`}
                          type="text"
                          name="address2"
                          onChange={handleShippingInputChange}
                          placeholder="Apartment, suite, unit, etc (optional) "
                        />
                      </div>

                      <div className="form-group col-md-12 col-sm-12 col-xs-12">
                        <div className="field-label">City</div>
                        <input
                          type="text"
                          className={`${errors.city ? "error_border" : ""}`}
                          name="city"
                          onChange={handleShippingInputChange}
                        />
                      </div>
                      <div className="form-group col-md-12 col-sm-6 col-xs-12">
                        <div className="field-label">State</div>
                        <input
                          type="text"
                          className={`${errors.state ? "error_border" : ""}`}
                          name="state"
                          onChange={handleShippingInputChange}
                        />
                      </div>
                      <div className="form-group col-md-12 col-sm-6 col-xs-12">
                        <div className="field-label">Postal Code</div>
                        <input
                          type="text"
                          name="pincode"
                          onChange={handleShippingInputChange}
                          className={`${errors.pincode ? "error_border" : ""}`}
                        />
                      </div>

                      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <input
                          type="checkbox"
                          name="create_account"
                          id="account-option"
                        />
                        &ensp;{" "}
                        <label htmlFor="account-option">
                          Create An Account?
                        </label>
                      </div>
                    </div>
                  </Form>
                )}
                {/* 
                {Object.keys(billingFormData).length > 0 && (
                  <div>
                    <h4>Billing Form Data:</h4>
                    <pre>{JSON.stringify(billingFormData, null, 2)}</pre>
                  </div>
                )}

                {Object.keys(shippingFormData).length > 0 && (
                  <div>
                    <h4>Shipping Form Data:</h4>
                    <pre>{JSON.stringify(shippingFormData, null, 2)}</pre>
                  </div>
                )}
                {Object.keys(orderItems).length > 0 && (
                  <div>
                    <h4>OrderItems:</h4>
                    <pre>{JSON.stringify(orderItems, null, 2)}</pre>
                  </div>
                )}
                {Object.keys(orderNotes).length > 0 && (
                  <div>
                    <h4>orderNotes:</h4>
                    <pre>{JSON.stringify(orderNotes, null, 2)}</pre>
                  </div>
                )} */}
              </Col>
              <Col lg="6" sm="12" xs="12">
                {cartItems && cartItems.length > 0 > 0 ? (
                  <div className="checkout-details">
                    <div className="order-box">
                      <div className="title-box">
                        <div>
                          Product <span>Total</span>
                        </div>
                      </div>
                      <ul className="qty">
                        {cartItems.map((item, index) => (
                          <li key={index}>
                            <div className="checkoutProductList">
                              {/* Displaying size and quantity from selectedSizesQuantities */}

                              <p>
                                <b>
                                  {item.name} ×
                                  {item.sizesQuantities &&
                                  Array.isArray(item.sizesQuantities) &&
                                  item.sizesQuantities.length > 0
                                    ? item.sizesQuantities.reduce(
                                        (totalQty, sizeQuantity) =>
                                          totalQty + sizeQuantity.quantity,
                                        0
                                      )
                                    : 0}
                                </b>{" "}
                              </p>
                              <p>Color : {item.color}</p>
                              <p>Size / Quantity: </p>
                              {item.sizesQuantities &&
                              Array.isArray(item.sizesQuantities) &&
                              item.sizesQuantities.length > 0 ? (
                                item.sizesQuantities.map(
                                  (sizeQuantity, index) => (
                                    <div key={index}>
                                      <p style={{ margin: "3px 0px" }}>
                                        {sizeQuantity.size} /{" "}
                                        {sizeQuantity.quantity}
                                        {/* (
                                          {sizeQuantity.item_number}){" "} */}
                                      </p>
                                    </div>
                                  )
                                )
                              ) : (
                                <p>
                                  No size or quantity information available.
                                </p>
                              )}
                            </div>
                            <div className="checkoutTotalList">
                              <span>
                                {symbol}
                                {item.totalPrice}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <ul className="sub-total">
                        <li>
                          Subtotal{" "}
                          <span className="count">
                            {symbol}
                            {cartTotal.toFixed(2)}
                          </span>
                        </li>
                        {appliedCoupon && (
                          <li>
                            Discount ({appliedCoupon.code}){" "}
                            <span className="count">
                              -{symbol}
                              {discountAmount.toFixed(2)}
                            </span>
                            <Button onClick={removeCoupon}>Remove</Button>
                          </li>
                        )}
                        <li>
                          {/* Shipping options */}

                          {!loading && shippingAvailable ? (
                            <div className="shipping-methods">
                              <ul>
                                <li>
                                  Shipping:
                                  <ul>
                                    {shippingMethods.map((method) => (
                                      <li key={method.id}>
                                        <span className="count">
                                          <input
                                            type="radio"
                                            name="shippingMethod"
                                            value={method.id}
                                            onChange={
                                              handleShippingMethodChange
                                            }
                                            defaultChecked={
                                              selectedShippingMethod ===
                                              method.id
                                            }
                                            id={`shipping-${method.id}`}
                                          />
                                          <label
                                            htmlFor={`shipping-${method.id}`}
                                            style={{ marginLeft: "5px" }}
                                          >
                                            {method.title}
                                            {method.method_id !==
                                              "free_shipping" &&
                                              ` : ${symbol}${method.price}`}
                                          </label>
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <div className="shipping-methods">
                              <ul>
                                <li>
                                  Shipping :
                                  <span className="count">
                                    Shipping not available for the provided
                                    location
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          <div className="shipping-methods">
                            <ul>
                              <li>
                                Tax Amount{" "}
                                <span className="count">
                                  {symbol}
                                  {taxAmount.toFixed(2)}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                      <ul className="total">
                        <li>
                          Order Total{" "}
                          <span className="count">
                            {symbol}
                            {orderTotal}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="payment-box">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleApplyCoupon();
                        }}
                        className="coupon-form"
                      >
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="coupon-input"
                        />
                        <Button type="submit" className="coupon-button">
                          Apply Coupon
                        </Button>
                      </form>
                      {couponError && (
                        <p style={{ color: "red", marginTop: "2px" }}>
                          {couponError}
                        </p>
                      )}
                      {cartTotal !== 0 ? (
                        <div className="text-end">
                          <Elements stripe={stripePromise}>
                            <CheckoutButton
                              customerId={customerId}
                              billingFormData={billingFormData}
                              shippingFormData={shippingFormData}
                              cartData={cartItems}
                              stripeShippingOptions={stripeShippingOptions}
                              taxRate={taxRate}
                              billingFormValid={billingFormValid}
                              shippingFormValid={shippingFormValid}
                              shippingAvailable={shippingAvailable}
                              orderNotes={orderNotes}
                              appliedCoupon={
                                appliedCoupon ? appliedCoupon.code : ""
                              }
                              discountAmount={discountAmount}
                            />
                          </Elements>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CheckoutPage;
