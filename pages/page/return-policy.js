import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media } from "reactstrap";



const ReturnPolicy = () => {
  return (
    <>
      <CommonLayout parent="home" title="Return Policy">
        <div>
     
         <div className="bg-img main-img subpage"
                   style={{
                    backgroundImage: 'url(/assets/images/misc/return-policy.jpg)',
                    backgroundPositionY: '68%'
                }}>
                <Container>
                    <div className="main-title text-bottom">
                        <h1 className="text-gray title-text">Return Policy</h1>
                    </div>
                </Container>
              </div>
        </div>
      
        {/* // <!-- ReturnPolicy section start --> */}
        <section className="policy-page section-b-space">
          <Container>
            <Row>
              <Col lg="12">
              <div className="policy-body">
                <p>
                If you have an issue or concern with an order you have received, contact our Customer Service Team at <a href="mailto:sales@hoytcompany.com">sales@hoytcompany.com</a>.
                </p>
                <br />
                <p>
                    When you call, please have your invoice ready, along with the style number, color and quantity you want to discuss. 
                </p>
                <br />
                <h6>Please review our terms before you reach out:</h6>
                <ul className="bullet-points">
                    <li>We do not process returns on printed, washed or decorated merchandise.</li>
                    <li>You must return defective merchandise to us with a piece of tape indicating the flaw’s location.</li>
                    <li>We do not accept returns on discontinued items or merchandise that is more than 30 days old.</li>
                    <li>You must make all claims for shortages or damages within 72 hours of receiving the merchandise.</li>
                    <li>Without a valid return authorization number, our warehouse will not accept returns.</li>
                    <li>Please include a copy of your invoice to ensure we can issue you a proper credit within two weeks.</li>
                    <li>All returned or refused shipments are subject to a 20% or $25 (whichever is greater) restocking charge, in addition to both outbound and return freight costs.</li>
                    <li>We do not provide cash refunds.</li>
                    <li>If we did not process your order accurately, we’ll cover the original freight and send a return label for the incorrect merchandise.</li>
                    <li>Please note that products that are considered non-returnable are noted as such on their respective product page, the inventory quantity will be underlined in orange. These products include but are not limited to: closeout items, face covers, items received directly from the vendor, items that receive a sample discount, etc.</li>
                    <li>We do offer a replacement option if the items that you have received on your original order are incorrect, missing or damaged. Requesting a replacement will initiate a replacement order that will include the same items as your original order. Please note, we are not able to accommodate any style, color, size swap or exchange requests via a replacement order.</li>
                </ul>
               
                </div>

              </Col>
            </Row>
          </Container>
        </section>
       
      </CommonLayout>
    </>
  );
};

export default ReturnPolicy;
