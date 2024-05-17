import React, { useContext, useState, useEffect } from "react";
import { Media, Container, Form, Row, Col } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import paypal from "../../../../public/assets/images/paypal.png";
import { PayPalButton } from "react-paypal-button-v2";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutButton from "../../../../components/checkout/CheckoutButton";

const stripePromise = loadStripe(
  "pk_test_I8XFeUwEEFSEVuNZm11k8btS"
); // Replace with your actual Stripe publishable key

const CheckoutPage = () => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const [obj, setObj] = useState({});
  const [payment, setPayment] = useState("cod");
  const [billingFormData, setBillingFormData] = useState({});
  const [shippingFormData, setShippingFormData] = useState({});
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false); // State to manage whether to ship to a different address
  const [shippingAvailable, setShippingAvailable] = useState(true); // State to track shipping availability
  const [shippingMethods, setShippingMethods] = useState([]); // State to store available shipping methods
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to store error
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null); // State to store selected shipping method
  const [shippingCost, setShippingCost] = useState(0); // State to store shipping cost
  const [stripeShippingOptions, setStripeShippingOptions] = useState(0); // State to store shipping cost
  const [orderTotal, setOrderTotal] = useState(0);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // initialise the hook
  const router = useRouter();


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
      }
    }
  };
  
  const handleShippingInputChange = (event) => {
    const { name, value } = event.target;
    console.log("Shipping Form Data:", { ...shippingFormData, [name]: value });
    setShippingFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };
      return updatedFormData;
    });
  };
  
// only for test, delete latter
  const orderItems = cartItems.flatMap(item => {
    // Extracting sizeQuantities data and directly returning it
    return item.sizesQuantities.map(({ item_number, quantity }) => ({ item_number, quantity }));
});


useEffect(() => {
  const fetchShippingZones = async () => {
    try {
      const response = await fetch("https://tonserve.com/hfh/wp-json/wc/v3/shipping/zones/2/locations?consumer_key=ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2&consumer_secret=cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea");
      if (!response.ok) {
        throw new Error("Failed to fetch shipping zones");
      }
      const data = await response.json();
      const country = shippingFormData.country;
      const postcode = shippingFormData.pincode;

      console.log("Country:", country, "Postcode:", postcode);

      const match = data.find(location => location.code === country || location.code === postcode);

      console.log("Matching location:", match);

      if (match) {
        setShippingAvailable(true);
        // If shipping is available, fetch shipping methods
        console.log("Shipping available. Fetching shipping methods...");
        const methodsResponse = await fetchShippingMethods();
        console.log("Methods response:", methodsResponse);

      // Filter shipping methods based on conditions
          const filteredMethods = methodsResponse.filter(method => {
            if (method.method_id === "free_shipping") {
              // Check if free shipping has a minimum amount set
              if (method.settings && method.settings.min_amount && cartTotal >= method.settings.min_amount.value) {
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
    const response = await fetch("https://tonserve.com/hfh/wp-json/wc/v3/shipping/zones/2/methods?consumer_key=ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2&consumer_secret=cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea");
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
    const selectedMethod = shippingMethods.find(method => method.id === selectedValue);
  
    if (selectedMethod) {
      // Update the shipping cost with the price of the selected method
      setShippingCost(selectedMethod.price);
      console.log("shippingCost:", shippingCost);

 // Convert selectedMethod to an array
 const selectedMethodArray = [{
  method_id: selectedMethod.method_id,
  title: selectedMethod.title,
  amount: selectedMethod.price
}];
  // Call setStripeShippingOptions function with selectedMethodArray as parameter
  setStripeShippingOptions(selectedMethodArray);
  console.log("StripeShippingOptions:", stripeShippingOptions);

    }
  };

  


  // calclulating Total Order Price here (cart price + shipping + tax - discount[coupons])
 useEffect(() => {
  // Convert cartTotal and shippingCost to numbers using parseFloat
  const total = parseFloat(cartTotal) + parseFloat(shippingCost);
  setOrderTotal(total); // Update orderTotal
}, [cartTotal, shippingCost]);

  // const setStateFromInput = (event) => {
  //   obj[event.target.name] = event.target.value;
  //   setObj(obj);
  // };




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
                      defaultValue="US" // Set the default value to "US"
                    >
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
                </div>
              </Form>
                      
                      <div className="row check-out">
                      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{margin:"20px 0px"}}>
                        <input
                          type="checkbox"
                          name="ship_to_different_address"
                          id="ship-to-different-address"
                          onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                        />
                        &ensp;
                        <label htmlFor="ship-to-different-address">Ship to a different address?</label>
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
                              className={`${errors.first_name ? "error_border" : ""}`}
                              name="first_name"
                              onChange={handleShippingInputChange}
                            />
                            
                          </div>
                          <div className="form-group col-md-6 col-sm-6 col-xs-12">
                            <div className="field-label">Last Name</div>
                            <input
                              type="text"
                              className={`${errors.last_name ? "error_border" : ""}`}
                              name="last_name"
                              onChange={handleShippingInputChange}
                            />
                           
                          </div>
                          <div className="form-group col-md-12 col-sm-12 col-xs-12">
                            <div className="field-label">Country</div>
                            <select
                              name="country"
                              onChange={handleShippingInputChange}
                              defaultValue="US" // Set the default value to "US"
                            >
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
                            <label htmlFor="account-option">Create An Account?</label>
                          </div>
                        </div>
                      </Form>

                    )}

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
                                 
                                    {
                                    item.sizesQuantities && Array.isArray(item.sizesQuantities) && item.sizesQuantities.length > 0 ?
                                      item.sizesQuantities.reduce((totalQty, sizeQuantity) => totalQty + sizeQuantity.quantity, 0) :
                                      0
                                    }
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
                          <li>
                           {/* Shipping options */}



                  {!loading && shippingAvailable && (
                    <div className="shipping-methods">
                      <h4>Shipping Methods:</h4>
                      <ul>
                        {shippingMethods.map(method => (
                          <li key={method.id}>
                           <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            defaultChecked ={selectedShippingMethod === method.id}
                            onChange={handleShippingMethodChange}
                          />
                            <label>
                                  {method.title}
                                  {method.method_id === "flat_rate" && ` : ${method.price}`} {/* Render price if method_id is flat_rate */}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                        
                        {cartTotal !== 0 ? (
                          <div className="text-end">
                           
                           <Elements stripe={stripePromise}>
                            {/* Pay with stripe button */}
                                <CheckoutButton
                                        billingFormData={billingFormData}
                                        shippingFormData={shippingFormData}
                                        cartData={cartItems}
                                        stripeShippingOptions={stripeShippingOptions}
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


