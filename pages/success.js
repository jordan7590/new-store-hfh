import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import Stripe from 'stripe';
import axios from 'axios';
import CommonLayout from '../components/shop/common-layout';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function getServerSideProps(context) {
  const { session_id } = context.query;

  if (!session_id) {
    return { props: { error: 'Missing session_id parameter' } };
  }

  try {
    console.log('Fetching session with ID:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer'],
    });
    console.log('Session retrieved successfully');

    // Fetch WooCommerce order details using the stripe_session_id
    const wooCommerceOrder = await axios.get(
      `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3/orders`,
      {
        params: {
          meta_key: 'stripe_session_id',
          meta_value: session_id,
        },
        auth: {
          username: process.env.WOOCOMMERCE_CONSUMER_KEY,
          password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
        },
      }
    );

    if (wooCommerceOrder.data && wooCommerceOrder.data.length > 0) {
      return { 
        props: { 
          session: JSON.parse(JSON.stringify(session)),
          order: JSON.parse(JSON.stringify(wooCommerceOrder.data[0]))
        } 
      };
    } else {
      return { props: { error: 'WooCommerce order not found' } };
    }
  } catch (err) {
    console.error('Error retrieving data:', err);
    return { 
      props: { 
        error: 'Error retrieving data',
        errorDetails: err.message,
        errorType: err.type,
      } 
    };
  }
}

const SuccessPage = ({ session, order, error, errorDetails, errorType }) => {
  if (error) {
    return (
      <CommonLayout parent="home" title="Order Error">
        <Container className="mt-5">
          <Row>
            <Col>
              <div className="error-message">
                <h4>{error}</h4>
                <p>{errorDetails}</p>
                <p>Error type: {errorType}</p>
                <p>Please try again later or contact customer support.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </CommonLayout>
    );
  }

  if (!session || !order) {
    return (
      <CommonLayout parent="home" title="Order Not Found">
        <Container className="mt-5">
          <Row>
            <Col>
              <div className="warning-message">No order details found.</div>
            </Col>
          </Row>
        </Container>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout parent="home" title="Order Success">
      <div className="success-page">
        <Container>
          <div className="confirmation-message">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
            <h2 style={{textTransform:'capitalize'}}>Thank you <span style={{color:'#009bda'}}>{order.billing.first_name}!</span> </h2>
            <p>Your order <b> #{order.number} </b> is completed successfully</p>
          </div>

          <Row>
            <Col md="6">
              <Card className="mb-4">
                <CardBody>
                  <h4>Your Order is Confirmed</h4>
                  <p>We have accepted your order, and we're getting it ready. A confirmation email has been sent to {order.billing.email}</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h4>Customer Details</h4>
                  <p><strong>Email:</strong> {order.billing.email}</p>
                  <Row>
                    <Col md="6">
                      <h5>Billing address</h5>
                      <p>
                        {order.billing.first_name} {order.billing.last_name}<br />
                        {order.billing.address_1}<br />
                        {order.billing.address_2 && `${order.billing.address_2}<br />`}
                        {order.billing.city}, {order.billing.state} {order.billing.postcode}
                      </p>
                    </Col>
                    <Col md="6">
                      <h5>Shipping address</h5>
                      <p>
                        {order.shipping.first_name} {order.shipping.last_name}<br />
                        {order.shipping.address_1}<br />
                        {order.shipping.address_2 && `${order.shipping.address_2}<br />`}
                        {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card>
                <CardBody>
                  <h4>Order Details</h4>
                  {order.line_items.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <img src={item.image?.src || '/placeholder-image.jpg'} alt={item.name} className="product-image" />
                        <span>{item.name} x {item.quantity}</span>
                      </div>
                      <span className="price">${parseFloat(item.total).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${parseFloat(order.total - order.total_tax - parseFloat(order.shipping_total)).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Tax</span>
                    <span>${parseFloat(order.total_tax).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Discount</span>
                    <span>-${parseFloat(order.discount_total).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Shipping</span>
                    <span>${parseFloat(order.shipping_total).toFixed(2)} via {order.shipping_lines[0].method_title}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Payment method</span>
                    <span>{order.payment_method_title}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between total">
                    <strong>Total</strong>
                    <strong>${parseFloat(order.total).toFixed(2)}</strong>
                  </div>
                  {order.payment_method === "cod" && (
                    <p className="payment-note">Pay with cash upon delivery.</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>{`
        .success-page {
          background-color: #f0f8ff;
          padding: 2rem 0;
        }
        .confirmation-message {
          text-align: center;
          margin-bottom: 2rem;
        }
        .checkmark-circle {
          width: 60px;
          height: 60px;
          background-color: #009bda;
          border-radius: 50%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1rem;
        }
        .checkmark {
          width: 18px;
          height: 36px;
          border: solid #fff;
          border-width: 0 8px 8px 0;
          transform: rotate(45deg);
        }
        h2 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        h4 {
          color: #333;
          margin-bottom: 1rem;
        }
        .product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          margin-right: 1rem;
        }
        .price {
          font-weight: bold;
        }
        .total {
          font-size: 1.2em;
          color: #ff9999;
        }
        .payment-note {
          margin-top: 1rem;
          font-style: italic;
        }
      `}</style>
    </CommonLayout>
  );
};

export default SuccessPage;