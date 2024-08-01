import React, { useState, useEffect } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Input, Container, Row, Form, Label, Col } from "reactstrap";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from './AuthContext';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/page/account/dashboard");
      toast.error('You are logged in. Logout for new registration');
    }
  }, [isLoggedIn, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://hfh.tonserve.com/wp-json/wp/v2/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
          }),
          credentials: 'include', 
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseData = await response.text();
      console.log('Response body:', responseData);

      let jsonData;
      try {
        jsonData = JSON.parse(responseData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error('Invalid response from server');
        return;
      }
      
      if (response.ok) {
        toast.success("Registration successful. Please login with your username/email and password.");
        router.push("/page/account/login");
      } else {
        // Handle registration errors
        if (jsonData.code === 'existing_user_login' || jsonData.code === 'existing_user_email') {
          toast.error("This username or email is already registered. Please try logging in or use a different email/username.");
        } else if (jsonData.message) {
          toast.error(jsonData.message);
        } else {
          // Check for specific field errors
          const fieldErrors = ['username', 'email', 'password', 'first_name', 'last_name'];
          let errorDisplayed = false;
          
          fieldErrors.forEach(field => {
            if (jsonData[field] && jsonData[field].length > 0) {
              console.log(`${field.charAt(0).toUpperCase() + field.slice(1)} Error:`, jsonData[field][0]);
              toast.error(jsonData[field][0]);
              errorDisplayed = true;
            }
          });

          // If no specific error was caught, display a generic error message
          if (!errorDisplayed) {
            toast.error("Registration failed. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to create an account now. Please try again later.");
    }
  };

  return (
    <CommonLayout parent="home" title="register">
      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="12">
              <h3>Create Account</h3>
              <div className="theme-card">
                <Form className="theme-form" onSubmit={handleRegister}>
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="username">
                        Username
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Username"
                        required=""
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        required=""
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="first_name">
                        First Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="first_name"
                        placeholder="First Name"
                        required=""
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="last_name">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="last_name"
                        placeholder="Last Name"
                        required=""
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="password">
                        Password
                      </Label>
                      <Input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        required=""
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="confirm_password">
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        className="form-control"
                        id="confirm_password"
                        placeholder="Confirm your password"
                        required=""
                        value={formData.confirm_password}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <button type="submit" className="btn btn-solid w-auto">
                        Create Account
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Register;