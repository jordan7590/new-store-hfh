import React, { useState } from 'react';
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Col, Media, Form, Label, Input } from "reactstrap";

const Data = [
  {
    img: "fa-phone",
    title: "Contact us",
    desc1: "Customer Service: 810.547.1646",
    desc2: "Sales: 810.624.4445",
  },
  {
    img: "fa-map-marker",
    title: "Shipping address",
    desc1: "Hoyt & Company 12555 N. Saginaw Rd.",
    desc2: "Clio, MI 48420",
  },
  {
    img: "fa-map-marker",
    title: "Mailing order forms",
    desc1: "Hoyt & Company PO Box 182",
    desc2: "Clio, MI 48420",
  },
  {
    img: "fa-envelope-o",
    title: "Email",
    desc1: "sales@hoytcompany.com",
    desc2: "sales@medicallogowear.com",
  },
];

const ContactDetail = ({ img, title, desc1, desc2 }) => {
  return (
    <li>
      <div className="contact-icon">
        <i className={`fa ${img}`} aria-hidden="true"></i>
        <h6>{title}</h6>
      </div>
      <div className="media-body">
        <p>{desc1}</p>
        <p>{desc2}</p>
      </div>
    </li>
  );
};


const Contact = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    reason: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form data submitted:', formData);
  };


  return (
    <CommonLayout parent="home" title="Contact">
      <section className="contact-page section-b-space">
        {/* <Container>
          <Row className="section-b-space">
            <Col lg="7" className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11635.590117161715!2d-83.725397!3d43.1906609!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88238faeb32a73d1%3A0xaaad431bf26220a9!2sHoyt%20%26%20Company%20-%20Screen%20Printing%20and%20Embroidery!5e0!3m2!1sen!2sin!4v1700587518141!5m2!1sen!2sin"
                allowFullScreen
              ></iframe>
            </Col>
            <Col lg="5">
              <div className="contact-right">
                <ul>
                  {Data.map((data, i) => {
                    return (
                      <ContactDetail
                        key={i}
                        img={data.img}
                        title={data.title}
                        desc1={data.desc1}
                        desc2={data.desc2}
                      />
                    );
                  })}
                </ul>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Form className="theme-form">
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="name">First Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter Your name"
                      required=""
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">Last Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Email"
                      required=""
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="review">Phone number</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="review"
                      placeholder="Enter your number"
                      required=""
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">Email</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      required=""
                    />
                  </Col>
                  <Col md="12">
                    <Label className="form-label" for="review">Write Your Message</Label>
                    <textarea
                      className="form-control"
                      placeholder="Write Your Message"
                      id="exampleFormControlTextarea1"
                      rows="6"
                    ></textarea>
                  </Col>
                  <Col md="12">
                    <button className="btn btn-solid" type="submit">
                      Send Your Message
                    </button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container> */}


      <div className="header-image__container___xmXph">
        <div className="header-image__textContainer___y_asx">
          <div className="header-image__textWrapper___vgYFX">
            <span className="header-image__subtitle___MvRyt">Chat with us</span>
            <div className="header-image__title___xEfTS">
              <span className="header-image__titleLine1___WNCQg">Let's talk</span>
            </div>
            <span className="header-image__description___rENFG">
              Let us know what you're looking for and one of our team members will respond as soon as possible. We're excited to hear from you and looking forward to helping you out with amazing Swag.
            </span>
          </div>
        </div>
        <div className="header-image__image___hv4HR contact__newHeaderImage___vysSP"></div>
      </div>

      <div className="contact__findUsSection___TA7CH">
        <div className="contact__findUsContainer___gu8w_">
          <div className="contact__findUsHeader___r2NCi">
            <h3 className="contact__findUsHeaderTitle___VIaHm">FIND US</h3>
            <hr className="contact__findUsHeaderLine___a_XIM" />
          </div>
          <div className="contact__findUsContent___V_g8h">
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon1___d1YBX" src="https://static.swag.com/images-webpack/contact_1.45f66a012aa19222330a..svg" alt="Icon representing a location marker" />
              <h5 className="contact__findUsItemTitle___IVlAD">Address</h5>
              <p className="contact__findUsItemDescription___KUwHf">Hoyt & Company 12555 N. Saginaw Rd.</p>
            </div>
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon2___V5StJ" src="https://static.swag.com/images-webpack/contact_2.7abc2a903c8306129232..svg" alt="Icon depicting an envelope, commonly used to represent email or messaging" />
              <h5 className="contact__findUsItemTitle___IVlAD">Email</h5>
              <p className="contact__findUsItemDescription___KUwHf">sales@hoytcompany.com</p>
            </div>
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon3___V5LLu" src="https://static.swag.com/images-webpack/contact_3.4aec7bfb84a85e8d0300..svg" alt="Icon representing a telephone, usually indicating a voice call feature or contact via phone" />
              <h5 className="contact__findUsItemTitle___IVlAD">Phone</h5>
              <p className="contact__findUsItemDescription___KUwHf">810.547.1646</p>
            </div>
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon4___XnB2y" src="https://static.swag.com/images-webpack/contact_4.882fa2bc77a5ac381129..svg" alt="Icon with the word 'OPEN' within an outlined hanging sign, suggesting a business status or an invitation to enter a location or webpage" />
              <h5 className="contact__findUsItemTitle___IVlAD">Opening hours</h5>
              <p className="contact__findUsItemDescription___KUwHf">
                Monday-Thursday :
                
                7am to 5pm EST
                <br />
                Friday:              
                Appointment only 
                <br />
                Saturday/Sunday: Closed

              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="contact__formSection___v7QQA">
      <div className="contact__formContainer___GjuCr">
        <div className="contact__formHeader___nDtbp">
          <span className="contact__formHeaderTitle___iCqt7">Reach out to us!</span>
          <span className="contact__formHeaderDescription___Nnp3c">We are here to help! Fill out the information below and one of our team members will be in touch.</span>
        </div>
        <form onSubmit={handleSubmit} className="contact__formInputsContainer___R_2dE">
          <div className="contact__formNameInputsContainer___NfWc3">
            <div className="MuiFormControl-root form-input-text__container___UZW4T contact__inputText___ieMCR">
              <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink" data-shrink="true">First name *</label>
              <div className="MuiInputBase-root MuiInputBase-formControl" meta="[object Object]">
                <input
                  aria-invalid="false"
                  name="firstName"
                  placeholder="Your first name"
                  type="text"
                  className="MuiInputBase-input"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="MuiFormControl-root form-input-text__container___UZW4T contact__inputText___ieMCR">
              <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink" data-shrink="true">Last name *</label>
              <div className="MuiInputBase-root MuiInputBase-formControl" meta="[object Object]">
                <input
                  aria-invalid="false"
                  name="lastName"
                  placeholder="Your last name"
                  type="text"
                  className="MuiInputBase-input"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="MuiFormControl-root form-input-text__container___UZW4T contact__inputText___ieMCR">
            <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink" data-shrink="true">Email address *</label>
            <div className="MuiInputBase-root MuiInputBase-formControl" meta="[object Object]">
              <input
                aria-invalid="false"
                name="email"
                placeholder="Enter your email address"
                type="email"
                className="MuiInputBase-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="MuiFormControl-root form-select__container___zgH81">
            <div className="MuiFormControl-root form-input-text__container___UZW4T contact__inputText___ieMCR contact__inputContainer___1bTcY">
              <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink" data-shrink="true">How can we help you? *</label>
              <div className="MuiInputBase-root MuiInputBase-formControl" meta="[object Object]">
                <select
                  name="reason"
                  className="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input"
                  value={formData.reason}
                  onChange={handleChange}
                >
                  <option value="">Select an option</option>
                  {/* Add other options here */}
                </select>
              </div>
            </div>
          </div>
          <div className="MuiFormControl-root form-input-text__container___UZW4T form-input-textarea__container___G05ro contact__inputText___ieMCR">
            <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink" data-shrink="true">Your Message *</label>
            <div className="MuiInputBase-root MuiInputBase-formControl MuiInputBase-multiline" meta="[object Object]">
              <textarea
                rows="1"
                aria-invalid="false"
                name="message"
                placeholder="What would you like to get in touch about?"
                className="MuiInputBase-input MuiInputBase-inputMultiline"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="contact__formButtonContainer___SIClG">
            <div className="form-button__container___bwqmp contact__formButton___N5NR5">
              <button
                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                type="submit"
              >
                <span className="MuiButton-label">Send</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
      </section>
    </CommonLayout>
  );
};

export default Contact;
