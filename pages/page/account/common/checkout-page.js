import React, { useContext, useState } from "react";
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
                            Shipping
                            <div className="shipping">
                              <div className="shopping-option">
                                <input
                                  type="checkbox"
                                  name="free-shipping"
                                  id="free-shipping"
                                />
                                <label htmlFor="free-shipping">
                                  Free Shipping
                                </label>
                              </div>
                              <div className="shopping-option">
                                <input
                                  type="checkbox"
                                  name="local-pickup"
                                  id="local-pickup"
                                />
                                <label htmlFor="local-pickup">
                                  Local Pickup
                                </label>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <ul className="total">
                          <li>
                            Total{" "}
                            <span className="count">
                              {symbol}
                              {cartTotal.toFixed(2)}
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


