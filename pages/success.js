import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Row, Col, Table } from 'reactstrap';

const SuccessPage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { session_id } = router.query;
    if (session_id) {
      fetchSessionDetails(session_id);
    }
  }, [router.query]);

  const fetchSessionDetails = async (sessionId) => {
    try {
      const response = await axios.get(`/api/checkout-session?session_id=${sessionId}`);
      setSession(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching session details:', err);
      setError('Failed to load order details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!session) {
    return <div>No order details found.</div>;
  }

  const billingInfo = JSON.parse(session.metadata.billing);
  const shippingInfo = JSON.parse(session.metadata.shipping);
  const orderItems = JSON.parse(session.metadata['order-items']);
  const shippingLines = JSON.parse(session.metadata.shipping_lines);
  const orderNotes = JSON.parse(session.metadata.order_notes);

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
          <p>{billingInfo.firstName} {billingInfo.lastName}</p>
          <p>{billingInfo.address1}</p>
          {billingInfo.address2 && <p>{billingInfo.address2}</p>}
          <p>{billingInfo.city}, {billingInfo.state} {billingInfo.postalCode}</p>
          <p>{billingInfo.country}</p>

          <h3 className="mt-4 mb-3">Shipping Information</h3>
          <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
          <p>{shippingInfo.address1}</p>
          {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
          <p>{shippingInfo.country}</p>

          <h3 className="mt-4 mb-3">Shipping Method</h3>
          <p>{shippingLines.method_title} - ${parseFloat(shippingLines.total).toFixed(2)}</p>

          {orderNotes && (
            <>
              <h3 className="mt-4 mb-3">Order Notes</h3>
              <p>{orderNotes}</p>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessPage;