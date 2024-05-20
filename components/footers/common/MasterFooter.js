import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Collapse,
} from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";

const MasterFooter = ({
  containerFluid,
  logoName,
  layoutClass,
  footerClass,
  footerLayOut,
  footerSection,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
  newLatter,
}) => {
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const width = window.innerWidth < 750;
  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth < 750) {
        setCollapse(0);
        setIsOpen(false);
      } else setIsOpen(true);
    };

    window.addEventListener("resize", changeCollapse);

    return () => {
      window.removeEventListener('resize', changeCollapse)
    }

  }, []);
  return (
    <div>
      <footer className={footerClass}>
        {newLatter ? (
          <div className={footerLayOut}>
            <Container fluid={containerFluid ? containerFluid : ""}>
              <section className={footerSection}>
                <Row>
                  <Col lg="6">
                    <div className="subscribe">
                      <div>
                        <h4>KNOW IT ALL FIRST!</h4>
                        <p>
                          Never Miss Anything From Multikart By Signing Up To
                          Our Newsletter.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg="6">
                    <Form className="form-inline subscribe-form">
                      <div className="mx-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button type="submit" className="btn btn-solid">
                        subscribe
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </section>
            </Container>
          </div>
        ) : (
          ""
        )}

        <section className={belowSection}>
          <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
            <Row className="footer-theme partition-f">
              <Col lg="4" md="6">
                <div
                  className={`footer-title ${isOpen && collapse == 1 ? "active" : ""
                    } footer-mobile-title`}
                >
                  <h4
                    onClick={() => {
                      setCollapse(1);
                      setIsOpen(!isOpen);
                    }}
                  >
                    about
                    <span className="according-menu"></span>
                  </h4>
                </div>
                <Collapse
                  isOpen={width ? (collapse === 1 ? isOpen : false) : true}
                >
                  <div className="footer-contant">
                    <div className="footer-logo">
                      {/* <LogoImage logo={logoName} /> */}
                      <img src={`/assets/images/icon/hc-full-no-background.png`} alt="Hoyt & Company Logo" style={{height:"80px", margin:"0px 0px 0px 7px"}} />
                    </div>
                    <p>
                    Welcome to Henry Ford Health Employee Uniform website provided by Hoyt & Company.
                    Our company offers a full line of decorated or blank apparel, uniforms, and promotional products. Our wide selection of apparel and promotional merchandise gives you the flexibility needed to create the professional image. Our orders are custom to fit your needs, please make sure you order correct sizes and approved colors for your department due to all items are custom and non-returnable.
                    </p>
                  </div>
                </Collapse>
              </Col>
              <Col className="offset-xl-1">
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 2 ? "active" : ""
                      } `}
                  >
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(2);
                        } else setIsOpen(true);
                      }}
                    >
                      Useful Links
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 2 ? isOpen : false) : true}
                  >
                    <div className="footer-contant">
                      <ul>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a>womens</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a> clothing </a>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a>accessories</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a> featured </a>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </div>
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 3 ? "active" : ""
                      } `}
                  >
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(3);
                        } else setIsOpen(true);
                      }}
                    >
                      Services
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 3 ? isOpen : false) : true}
                  >
                    <div className="footer-contant">
                      <ul>
                        <li>
                          <a href="#">shipping & return</a>
                        </li>
                        <li>
                          <a href="#">secure shopping</a>
                        </li>
                        
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
              <Col>
              <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 2 ? "active" : ""
                      } `}
                  >
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(2);
                        } else setIsOpen(true);
                      }}
                    >
                      Products
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 2 ? isOpen : false) : true}
                  >
                    <div className="footer-contant">
                      <ul>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a>womens</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a> clothing </a>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a>accessories</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar`}>
                            <a> featured </a>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </div>
               
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 3 ? "active" : ""
                      } `}
                  >
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(3);
                        } else setIsOpen(true);
                      }}
                    >
                      Company
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 3 ? isOpen : false) : true}
                  >
                    <div className="footer-contant">
                      <ul>
                        <li>
                          <a href="#">shipping & return</a>
                        </li>
                        <li>
                          <a href="#">secure shopping</a>
                        </li>
                       
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
              <Col>
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 4 ? "active" : ""
                      } `}
                  >
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(4);
                        } else setIsOpen(true);
                      }}
                    >
                      Get In Touch
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 4 ? isOpen : false) : true}
                  >

                 
                    <div className="footer-social social-custom">
                      <ul>
                        <li>
                          <a href="https://www.facebook.com/HoytCompany/" target="_blank">
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"
                            ></i>
                          </a>
                        </li>
                        
                        <li>
                          <a href="https://www.instagram.com/hoytcompany/" target="_blank">
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i>
                          </a>
                        </li>
                       
                      </ul>
                    </div>
                    
                   
                  </Collapse>
                </div>
                <div className="sub-title">
                  <div
                    className={`footer-title ${isOpen && collapse == 4 ? "active" : ""
                      } `}
                  >
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(4);
                        } else setIsOpen(true);
                      }}
                    >
                      subscribe
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 4 ? isOpen : false) : true}
                  >

                    
                    <Form className="form-inline subscribe-form">
                      <div className="my-sm-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button type="submit" className="btn btn-solid">
                        subscribe
                      </Button>
                    </Form>
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <CopyRight
          layout={layoutClass}
          fluid={CopyRightFluid ? CopyRightFluid : ""}
        />
      </footer>
    </div>
  );
};
export default MasterFooter;
