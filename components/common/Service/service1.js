import React from "react";
import {
  svgFreeShipping,
  svgservice,
  svgoffer,
} from "../../../services/script";
import { Container, Row, Col } from "reactstrap";
import MasterServiceContent from "./MasterServiceConternt";

const Data = [
  {
    link: svgFreeShipping,
    title: "Free Shipping",
    service: "Free Shipping on Orders $75+",
  },
  {
    link: svgservice,
    title: "24 X 7 ORDERING",
    service: "Order online 24 X 7, 365 Days a Year",
  },
  {
    link: svgoffer,
    title: "SPECIAL SERVICES",
    service: "We take care of everything so you save time and money",
  },
];

const ServiceLayout = ({ sectionClass }) => {
  return (
    <Container>
      <section className={sectionClass}>
        <Row>
          {Data.map((data, index) => {
            return (
              <Col md="4" className="service-block" key={index} style={{margin:"10px 0px"}}>
                <MasterServiceContent
                  link={data.link}
                  title={data.title}
                  service={data.service}
                />
              </Col>
            );
          })}
        </Row>
      </section>
    </Container>
  );
};

export default ServiceLayout;
