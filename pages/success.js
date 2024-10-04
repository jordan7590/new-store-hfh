import React from 'react';
import { Container, Row, Col, Table, Alert, Media } from 'reactstrap';
import Stripe from 'stripe';
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

      
    <CommonLayout parent="home" title="404">
    <section className="p-0">
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
</section>
</CommonLayout>


     
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

    <CommonLayout parent="home" title="404">
                  <section className="p-0">
                <Container>
                    <Row>
                        <Col sm="12">
                        <>
      <Table
        style={{ marginBottom: "0" }}
        borderless
        className="email-template-table"
        cellPadding="0"
        cellSpacing="0"
      >
        <tbody>
          <tr>
            <td>
              <Table className="top-sec" align="center" border="0" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td>
                      <Media className="email-media" src="/assets/images/email-temp/delivery.png" alt="" style={{ marginBottom: "0" }} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Media className="email-media" src="/assets/images/email-temp/success.png" alt="" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2 className="title">thank you</h2>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Payment Is Successfully Processed And Your Order Is On The Way</p>
                      <p>Transaction ID: {session.id}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ borderTop: "1px solid #777", height: "1px" }}></div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Media className="email-media" src="/assets/images/email-temp/order-success.png" alt="" />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table border="0" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      <h2 className="title">YOUR ORDER DETAILS</h2>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table className="order-detail" border="0" cellPadding="0" cellSpacing="0" align="left">
                <tbody>
                  <tr className="email-tr">
                    <th>PRODUCT</th>
                    <th style={{ paddingLeft: "15px" }}>DESCRIPTION</th>
                    <th>QUANTITY</th>
                    <th>PRICE</th>
                  </tr>
                  {orderItems.map((item, index) => (
                    <tr key={index} className="email-tr">
                      <td>
                        <Media style={{ margin: "0 auto" }} src={`/assets/images/product-${index + 1}.jpg`} alt="" width="70" />
                      </td>
                      <td valign="top" style={{ paddingLeft: "15px" }}>
                        <h5 style={{ marginTop: "15px", textAlign: "left" }}>{item.description}</h5>
                      </td>
                      <td valign="top" style={{ paddingLeft: "0" }}>
                        <h5 style={{ fontSize: "14px", color: "#444", marginTop: "15px", marginBottom: "0px" }}>
                          QTY : <span>{item.quantity}</span>
                        </h5>
                      </td>
                      <td valign="top" style={{ paddingLeft: "15px" }}>
                        <h5 style={{ fontSize: "14px", color: "#444", marginTop: "15px" }}>
                          <b>${item.amount_total / 100}</b>
                        </h5>
                      </td>
                    </tr>
                  ))}
                  <tr className="email-tr">
                    <td colSpan="2" style={{ lineHeight: "49px", fontSize: "13px", color: "#000000", paddingLeft: "20px", textAlign: "left", borderRight: "unset" }}>
                      Products:
                    </td>
                    <td colSpan="3" className="price" style={{ lineHeight: "49px", textAlign: "right", paddingRight: "28px", fontSize: "13px", color: "#000000", borderLeft: "unset" }}>
                      <b>${session.amount_subtotal / 100}</b>
                    </td>
                  </tr>
                  <tr className="email-tr">
                    <td colSpan="2" style={{ lineHeight: "49px", fontSize: "13px", color: "#000000", paddingLeft: "20px", textAlign: "left", borderRight: "unset" }}>
                      Shipping:
                    </td>
                    <td colSpan="3" className="price" style={{ lineHeight: "49px", textAlign: "right", paddingRight: "28px", fontSize: "13px", color: "#000000", borderLeft: "unset" }}>
                      <b>${parseFloat(shippingLines.total.replace(/"/g, '')).toFixed(2)}</b>
                    </td>
                  </tr>
                  <tr className="email-tr">
                    <td colSpan="2" style={{ lineHeight: "49px", fontSize: "13px", color: "#000000", paddingLeft: "20px", textAlign: "left", borderRight: "unset" }}>
                      TOTAL PAID:
                    </td>
                    <td colSpan="3" className="price" style={{ lineHeight: "49px", textAlign: "right", paddingRight: "28px", fontSize: "13px", color: "#000000", textAlignLast: "right", borderLeft: "unset" }}>
                      <b>${session.amount_total / 100}</b>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table className="product-info" cellPadding="0" cellSpacing="0" border="0" align="left" style={{ width: "100%", marginTop: "0", marginBottom: "30px" }}>
                <tbody>
                  <tr>
                    <td style={{ fontSize: "13px", color: "#444444", letterSpacing: "0.2px", width: "50%" }}>
                      <h5 style={{ fontSize: "16px", color: "#000", lineHeight: "16px", paddingBottom: "13px", borderBottom: "1px solid #e6e8eb", letterSpacing: "-0.65px", marginTop: "0", marginBottom: "13px", textAlign: "left" }}>
                        BILLING ADDRESS
                      </h5>
                      <p style={{ textAlign: "left", fontWeight: "normal", fontSize: "14px", color: "#000000", lineHeight: "21px", marginTop: "0" }}>
                        {billingInfo.first_name} {billingInfo.last_name}<br />
                        {billingInfo.address1}<br />
                        {billingInfo.address2 && `${billingInfo.address2}<br />`}
                        {billingInfo.city}, {billingInfo.state} {billingInfo.pincode}<br />
                        {billingInfo.country}
                      </p>
                    </td>
                    <td className="user-info">
                      <Media src="/assets/images/email-temp/space.jpg" alt=" " height="25" width="57" />
                    </td>
                    <td className="user-info" style={{ fontSize: "13px", color: "#444444", letterSpacing: "0.2px", width: "50%" }}>
                      <h5 style={{ fontSize: "16px", color: "#000", lineHeight: "16px", paddingBottom: "13px", borderBottom: "1px solid #e6e8eb", letterSpacing: "-0.65px", marginTop: "0", marginBottom: "13px", textAlign: "left" }}>
                        SHIPPING ADDRESS
                      </h5>
                      <p style={{ textAlign: "left", fontWeight: "normal", fontSize: "14px", color: "#000000", lineHeight: "21px", marginTop: "0" }}>
                        {shippingInfo.first_name} {shippingInfo.last_name}<br />
                        {shippingInfo.address1}<br />
                        {shippingInfo.address2 && `${shippingInfo.address2}<br />`}
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}<br />
                        {shippingInfo.country}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </td>
          </tr>
        </tbody>
      </Table>
      <style jsx>{`
        body {
          text-align: center;
          margin: 30px auto;
          width: 650px;
          font-family: "Open Sans", sans-serif;
          background-color: #e2e2e2;
          display: block;
        }
        .email-template-table {
          padding: 0 30px;
          background-color: #ffffff;
          box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);
          width: 100%;
        }
        .email-tr {
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }
        .email-media {
          margin-top: 30px;
          display: inline;
        }
        .title {
          color: #444444;
          font-size: 22px;
          font-weight: bold;
          padding-bottom: 0;
          text-transform: uppercase;
          display: inline-block;
          line-height: 1;
        }
        table.order-detail,
        .order-detail th,
        .order-detail td {
          border: 1px solid #ddd;
          border-collapse: collapse;
          padding: 0;
        }
        .order-detail th {
          font-size: 16px;
          padding: 15px;
          text-align: center;
        }
        @media (max-width: 767px) {
          .email-template-table {
            width: 520px;
          }
        }
        @media (max-width: 575px) {
          .email-template-table {
            width: 430px;
          }
        }
        @media (max-width: 479px) {
          .email-template-table {
            width: 322px;
          }
        }
        @media (max-width: 359px) {
          .email-template-table {
            width: 280px;
          }
        }
      `}</style>
    </>
                        </Col>
                    </Row>
                </Container>
            </section>
</CommonLayout>
  
  );
};

export default SuccessPage;