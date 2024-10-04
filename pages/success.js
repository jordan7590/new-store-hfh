import React from 'react';
import Stripe from 'stripe';
import { Container, Row, Col, Table, Alert } from 'reactstrap';

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
    return { props: { session: JSON.parse(JSON.stringify(session)) } };
  } catch (err) {
    console.error('Error retrieving Stripe session:', err);
    return { 
      props: { 
        error: 'Error retrieving Stripe session',
        errorDetails: err.message,
        errorType: err.type,
      } 
    };
  }
}

const SuccessPage = ({ session, error, errorDetails, errorType }) => {
  if (error) {
    return (
      <Container className="mt-5">
        <Row>
          <Col>
            <Alert color="danger">
              <h4>{error}</h4>
              <p>{errorDetails}</p>
              <p>Error type: {errorType}</p>
              <p>Please try again later or contact customer support.</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!session) {
    return <Container className="mt-5"><Row><Col><Alert color="warning">No order details found.</Alert></Col></Row></Container>;
  }

  const billingInfo = JSON.parse(session.metadata.billing);
  const shippingInfo = JSON.parse(session.metadata.shipping);
  const orderItems = JSON.parse(session.metadata['order-items']);
  const shippingLines = JSON.parse(session.metadata.shipping_lines);
  const orderNotes = session.metadata.order_notes ? JSON.parse(session.metadata.order_notes) : null;

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="mb-4">Order Confirmation</h1>
          <p>Thank you for your purchase! Your order has been successfully processed.</p>
          
          <h2 className="mt-4 mb-3">Order Details</h2>
          <Table bordered>
            <tbody>
              <tr>
                <th>Order ID</th>
                <td>{session.id}</td>
              </tr>
              <tr>
                <th>Total Amount</th>
                <td>${(session.amount_total / 100).toFixed(2)}</td>
              </tr>
              <tr>
                <th>Payment Status</th>
                <td>{session.payment_status}</td>
              </tr>
            </tbody>
          </Table>

          <h3 className="mt-4 mb-3">Ordered Items</h3>
          <Table bordered>
            <thead>
              <tr>
                <th>Item Number</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_number}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3 className="mt-4 mb-3">Billing Information</h3>
          <p>{billingInfo.first_name} {billingInfo.last_name}</p>
          <p>{billingInfo.address1}</p>
          {billingInfo.address2 && <p>{billingInfo.address2}</p>}
          <p>{billingInfo.city}, {billingInfo.state} {billingInfo.pincode}</p>
          <p>{billingInfo.country}</p>
          <p>Email: {billingInfo.email}</p>
          <p>Phone: {billingInfo.phone}</p>

          <h3 className="mt-4 mb-3">Shipping Information</h3>
          <p>{shippingInfo.first_name} {shippingInfo.last_name}</p>
          <p>{shippingInfo.address1}</p>
          {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}</p>
          <p>{shippingInfo.country}</p>

          <h3 className="mt-4 mb-3">Shipping Method</h3>
          <p>{shippingLines.method_title} - ${parseFloat(shippingLines.total.replace(/"/g, '')).toFixed(2)}</p>

          {orderNotes && (
            <>
              <h3 className="mt-4 mb-3">Order Notes</h3>
              <p>{orderNotes.replace(/"/g, '')}</p>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessPage;