import React, { useState, useEffect } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { useRouter } from "next/router";
import { useAuth } from './AuthContext';
import { toast } from "react-toastify";

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/page/account/dashboard");
      toast.error('You are already Logged In, Logout first to Login again');
    }
  }, [isLoggedIn, router]);

  const handleCreateAccountRouter = () => {
    router.push("/page/account/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://hfh.tonserve.com/wp-json/jwt-auth/v1/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (data.data && data.data.token) {
        login(data.data.token, {
          id: data.data.id,
          email: data.data.email,
          nicename: data.data.nicename,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          displayName: data.data.displayName
        });

        toast.success('Login successful!');
        router.push("/page/account/dashboard");
      } else {
        throw new Error("Token not received");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <CommonLayout parent="home" title="login">
      <section className="login-page section-b-space">
        <Container>
          <Row>
            <Col lg="6">
              <h3>Login</h3>
              <div className="theme-card">
                <Form className="theme-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <Label className="form-label" htmlFor="username">
                      Username or Email
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Username or Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label className="form-label" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-solid">
                    Login
                  </button>
                </Form>
                {error && <p className="error-message">{error}</p>}
              </div>
            </Col>
            <Col lg="6" className="right-login">
              <h3>New Customer</h3>
              <div className="theme-card authentication-right">
                <h6 className="title-font">Create A Account</h6>
                <p>
                  Sign up for a free account at our store. Registration is quick
                  and easy. It allows you to be able to order from our shop. To
                  start shopping click register.
                </p>
                <button
                  className="btn btn-solid w-auto"
                  onClick={handleCreateAccountRouter}
                >
                  Create an Account
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Login;