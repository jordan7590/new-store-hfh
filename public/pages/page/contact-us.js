import React, { useState } from 'react';
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media, Form, Label, Input } from "reactstrap";



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
      <section className="contact-page section-b-space" style={{paddingTop:"0px"}}>
       
      <div className="header-image__container___xmXph">
        <div className="header-image__textContainer___y_asx">
          <div className="header-image__textWrapper___vgYFX">
            <span className="header-image__subtitle___MvRyt">Chat with us</span>
            <div className="header-image__title___xEfTS">
              <span className="header-image__titleLine1___WNCQg">Let's talk</span>
            </div>
            <span className="header-image__description___rENFG">
              Let us know what you're looking for and one of our team members will respond as soon as possible.
               We're excited to hear from you and looking forward to helping you out with amazing Swag.
            </span>
          </div>
        </div>
        <div className="header-image__image___hv4HR contact__newHeaderImage___vysSP" style={{ backgroundImage: 'url(/assets/images/icon/contact-header.jpg)'}}></div>
      </div>

      <div className="contact__findUsSection___TA7CH" style={{ backgroundImage: 'url(/assets/images/icon/contact-bg-pc.svg)'}}>
        <div className="contact__findUsContainer___gu8w_">
          <div className="contact__findUsHeader___r2NCi">
            <h3 className="contact__findUsHeaderTitle___VIaHm" style={{textAlign:"center"}}>FIND US</h3>
            <hr className="contact__findUsHeaderLine___a_XIM" />
          </div>
          <div className="contact__findUsContent___V_g8h">
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon1___d1YBX" src="/assets/images/icon/contact-location.svg" alt="Icon representing a location marker" />
              <h5 className="contact__findUsItemTitle___IVlAD">Address</h5>
              <p className="contact__findUsItemDescription___KUwHf">Hoyt & Company 12555 N. Saginaw Rd.</p>
            </div>
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon2___V5StJ" src="/assets/images/icon/contact-email.svg" alt="Icon depicting an envelope, commonly used to represent email or messaging" />
              <h5 className="contact__findUsItemTitle___IVlAD">Email</h5>
              <p className="contact__findUsItemDescription___KUwHf">sales@hoytcompany.com</p>
            </div>
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon3___V5LLu" src="/assets/images/icon/contact-phone.svg" alt="Icon representing a telephone, usually indicating a voice call feature or contact via phone" />
              <h5 className="contact__findUsItemTitle___IVlAD">Phone</h5>
              <p className="contact__findUsItemDescription___KUwHf">810.547.1646</p>
            </div>
            <div className="contact__findUsItem___qBlB7">
              <img className="contact__findUsItemIcon4___XnB2y" src="/assets/images/icon/contact-open.svg" alt="Icon with the word 'OPEN' within an outlined hanging sign, suggesting a business status or an invitation to enter a location or webpage" />
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

      <div className="contact__formSection___v7QQA" style={{ backgroundImage: 'url(/assets/images/icon/contact-bg-pc-2.png)', paddingBottom:"20px"}}>
      <div className="contact__formContainer___GjuCr">
        <div className="contact__formHeader___nDtbp">
          <span className="contact__formHeaderTitle___iCqt7">Reach out to us!</span>
          <span className="contact__formHeaderDescription___Nnp3c">We are here to help! Fill out the information below and one of our team members will be in touch.</span>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-input-group">
                <div className="contact-input-container">
                <label className="contact-label">First name *</label>
                <div className="contact-input-wrapper">
                    <input
                    aria-invalid="false"
                    name="firstName"
                    placeholder="Your first name"
                    type="text"
                    className="contact-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    />
                </div>
                </div>
                <div className="contact-input-container">
                <label className="contact-label">Last name *</label>
                <div className="contact-input-wrapper">
                    <input
                    aria-invalid="false"
                    name="lastName"
                    placeholder="Your last name"
                    type="text"
                    className="contact-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    />
                </div>
                </div>
            </div>
            <div className="contact-input-container">
                <label className="contact-label">Email address *</label>
                <div className="contact-input-wrapper">
                <input
                    aria-invalid="false"
                    name="email"
                    placeholder="Enter your email address"
                    type="email"
                    className="contact-input"
                    value={formData.email}
                    onChange={handleChange}
                />
                </div>
            </div>
            <div className="contact-input-container">
                <label className="contact-label">How can we help you? *</label>
                <div className="contact-input-wrapper">
                <select
                    name="reason"
                    className="contact-input"
                    value={formData.reason}
                    onChange={handleChange}
                >
                    <option value="">Select an option</option>
                    <option value="">New Order Questions</option>
                    <option value="">Existing Order Questions</option>
                    <option value="">Shipping Questions</option>
                    <option value="">Other</option>
                    {/* Add other options here */}
                </select>
                </div>
            </div>
            <div className="contact-input-container">
                <label className="contact-label">Your Message *</label>
                <div className="contact-input-wrapper">
                <textarea
                    rows="4"
                    aria-invalid="false"
                    name="message"
                    placeholder="What would you like to get in touch about?"
                    className="contact-textarea"
                    value={formData.message}
                    onChange={handleChange}
                ></textarea>
                </div>
            </div>
            <div class="contact__formButtonContainer___SIClG">
                <div class="form-button__container___bwqmp contact__formButton___N5NR5">
                    <button class="btn btn-solid btn btn-primary" tabindex="0" type="button">
                        <span>Send</span>
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
