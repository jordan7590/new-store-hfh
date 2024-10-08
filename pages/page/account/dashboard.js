import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CommonLayout from "../../../components/shop/common-layout";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Spinner,
} from "reactstrap";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("accountInfo");
  const [accountInfo, setAccountInfo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    password: "",
    billing: {},
    shipping: {},
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const { userData, logout, isLoggedIn, updateUserData } = useAuth();
  const router = useRouter();

console.log("userData", userData);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/page/account/login");
    } else if (userData) {
      setFormData({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        bio: userData.bio,
        billing: userData.woocommerce_data.billing,
        shipping: userData.woocommerce_data.shipping,
      });
    }
  }, [isLoggedIn, router, userData]);

  useEffect(() => {
    if (activeTab === "myOrders") {
      fetchOrders();
    }
  }, [activeTab]);

  const toggleModal = (field = "") => {
    setEditField(field);
    setIsModalOpen(!isModalOpen);
  };

  const handleFormSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const userResponse = await fetch(
        "https://hfh.tonserve.com/wp-json/wp/v2/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!userResponse.ok) {
        const errorResponse = await userResponse.json();
        throw new Error("Error fetching user: " + errorResponse.message);
      }

      const currentUser = await userResponse.json();
      const userId = currentUser.id;

      const updateResponse = await fetch(
        `https://hfh.tonserve.com/wp-json/wp/v2/users/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            bio: formData.bio,
            username: formData.username,
            billing: formData.billing,
            shipping: formData.shipping,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorResponse = await updateResponse.json();
        throw new Error("Error updating user: " + errorResponse.message);
      }

      const updatedData = await updateResponse.json();
      console.log("User updated successfully:", updatedData);

      await updateUserData({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        bio: formData.bio,
        username: formData.username,
        billing: formData.billing,
        shipping: formData.shipping,
      });

      toast.success("User information updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user information:", error);
      toast.error("Failed to update user information. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("billing.")) {
      const billingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        billing: {
          ...prevData.billing,
          [billingField]: value,
        },
      }));
    } else if (name.startsWith("shipping.")) {
      const shippingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        shipping: {
          ...prevData.shipping,
          [shippingField]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/page/account/login");
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://hfh.tonserve.com/wp-json/custom/v1/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      const sortedOrders = data.sort(
        (a, b) => new Date(b.Date) - new Date(a.Date)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setOrdersError(
        "An error occurred while fetching your orders. Please Login again."
      );
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const renderOrders = () => {
    if (ordersLoading) {
        return <Spinner color="primary" />;
    }

    if (ordersError) {
        return <div className="text-danger">{ordersError}</div>;
    }

    if (orders.length === 0) {
        return <p>You haven't placed any orders yet.</p>;
    }

    return (
        <div className="order-list">
            {orders.map(order => (
                <Card key={order.ID} className="mb-3 order-item">
                    <CardBody className="py-3">
                        <Row className="align-items-center mb-4">
                            <Col xs="12">
                                <span className={`order-status status-${order.Status.toLowerCase()} mr-2`}>{order.Status}</span>
                                <span className="order-date mr-2">{order.Date}</span>
                                <span className="order-id" style={{fontWeight:'600'}}>Order ID: {order.ID}</span>
                            </Col>
                        </Row>
                        {order.LineItems.map((item, index) => (
                            <Row key={item.id} className="align-items-center mb-2">
                                <Col xs="2" sm="1">
                                    {item.image_urls && item.image_urls.length > 0 ? (
                                        <img src={item.image_urls[1]} alt={item.name} className="img-fluid rounded order-thumbnail" />
                                    ) : (
                                        <div className="no-image-placeholder order-thumbnail">No image</div>
                                    )}
                                </Col>
                                <Col xs="8" sm="9">
                                    <p className="mb-0 order-item-name">{item.name}</p>
                                    <small className="text-muted">Quantity: {item.quantity}</small>
                                </Col>
                                <Col xs="2" className="text-right">
                                    <div className="order-item-price">${parseFloat(item.total).toFixed(2)}</div>
                                </Col>
                            </Row>
                        ))}
                        <Row className="mt-4 pt-2" style={{borderTop:'solid 1px #e3e3e3'}}>
                            <Col xs="10">
                                <strong>Total:</strong>
                            </Col>
                            <Col xs="2" className="text-right">
                                <strong className="order-total">${parseFloat(order.Value).toFixed(2)}</strong>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

  const AccountInfo = () => (
    <>
    <div className="box-account box-info">
      <div className="box-head">
      <div className="page-title">
                    <h2>My Dashboard</h2>
                  </div>
                  <div className="welcome-msg">
                    <p>Hello, {userData.name}!</p>
                    <p>{userData.bio}</p>
                  </div>
        <h2>Account Information</h2>
      </div>
      <Row>
          <div className="box">
            <div className="box-title">
              <h3>Contact Information</h3>
              <a href="#" onClick={() => toggleModal("contact")}>
                Edit
              </a>
            </div>
            <div className="box-content">
              <h6>{userData.name}</h6>
              <h6>{userData.woocommerce_data.billing.email}</h6>
              {/* <h6>
                <a href="#" onClick={() => toggleModal("password")}>
                  Change Password
                </a>
              </h6> */}
            </div>
          </div>
        {/* <Col sm="6">
          <div className="box">
            <div className="box-title">
              <h3>Newsletters</h3>
              <a href="#">Edit</a>
            </div>
            <div className="box-content">
              <p>You are currently not subscribed to any newsletter.</p>
            </div>
          </div>
        </Col> */}
      </Row>
      
    </div>
     <div className="box">
     <div className="box-title">
       <h3>Address Book</h3>
       <a href="#" onClick={() => toggleModal("address")}>
         Manage Addresses
       </a>
     </div>
     <Row>
       <Col sm="6">
         <h6>Default Billing Address</h6>
         <address>
           {userData.woocommerce_data.billing.first_name}{" "}
           {userData.woocommerce_data.billing.last_name}
           <br />
           {userData.woocommerce_data.billing.company}
           <br />
           {userData.woocommerce_data.billing.address_1}
           <br />
           {userData.woocommerce_data.billing.address_2 &&
             `${userData.woocommerce_data.billing.address_2}<br />`}
           {userData.woocommerce_data.billing.city},{" "}
           {userData.woocommerce_data.billing.state}{" "}
           {userData.woocommerce_data.billing.postcode}
           <br />
           {userData.woocommerce_data.billing.country}
           <br />
           Phone: {userData.woocommerce_data.billing.phone}
           <br />
           <a href="#" onClick={() => toggleModal("address")}>
             Edit Address
           </a>
         </address>
       </Col>
       <Col sm="6">
         <h6>Default Shipping Address</h6>
         <address>
           {userData.woocommerce_data.shipping.first_name}{" "}
           {userData.woocommerce_data.shipping.last_name}
           <br />
           {userData.woocommerce_data.shipping.company}
           <br />
           {userData.woocommerce_data.shipping.address_1}
           <br />
           {userData.woocommerce_data.shipping.address_2 &&
             `${userData.woocommerce_data.shipping.address_2}<br />`}
           {userData.woocommerce_data.shipping.city},{" "}
           {userData.woocommerce_data.shipping.state}{" "}
           {userData.woocommerce_data.shipping.postcode}
           <br />
           {userData.woocommerce_data.shipping.country}
           <br />
           Phone: {userData.woocommerce_data.shipping.phone}
           <br />
           <a href="#" onClick={() => toggleModal("address")}>
             Edit Address
           </a>
         </address>
       </Col>
     </Row>
   </div>
    </>
  );

//   const MyWishlist = () => (
//     <div>
//       <h3>My Wishlist</h3>
//       <p>Items you've added to your wishlist will appear here.</p>
//     </div>
//   );




  const ChangePassword = () => (
    <div>
      <h3>Change Password</h3>
      <p>Update your password here.</p>
      <Button color="primary" onClick={() => toggleModal("password")}>
        Change Password
      </Button>
    </div>
  );

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <CommonLayout parent="home" title="dashboard">
      <section className="section-b-space">
        <Container>
          <Row>
            <Col lg="3">
              {window.innerWidth <= 991 && (
                <div
                  className="account-sidebar"
                  onClick={() => setAccountInfo(!accountInfo)}
                >
                  <a className="popup-btn">my account</a>
                </div>
              )}
              <div
                className="dashboard-left"
                style={accountInfo ? { left: "0px" } : {}}
              >
                {/* <div
                  className="collection-mobile-back"
                  onClick={() => setAccountInfo(!accountInfo)}
                >
                  <span className="filter-back">
                    <i className="fa fa-angle-left" aria-hidden="true"></i> back
                  </span>
                </div> */}
                <Nav vertical>
                  <NavItem>
                    <NavLink
                      className={activeTab === "accountInfo" ? "active" : ""}
                      onClick={() => setActiveTab("accountInfo")}
                    >
                      Account Info
                    </NavLink>
                  </NavItem>
                 
                  <NavItem>
                    <NavLink
                      className={activeTab === "myOrders" ? "active" : ""}
                      onClick={() => setActiveTab("myOrders")}
                    >
                      My Orders
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      className={activeTab === "myWishlist" ? "active" : ""}
                      onClick={() => setActiveTab("myWishlist")}
                    >
                      My Wishlist
                    </NavLink>
                  </NavItem> */}
                 
                 
                  <NavItem>
                    <NavLink
                      className={activeTab === "changePassword" ? "active" : ""}
                      onClick={() => setActiveTab("changePassword")}
                    >
                      Change Password
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={handleLogout}>Log Out</NavLink>
                  </NavItem>
                </Nav>
              </div>
            </Col>
            <Col lg="9">
              <div className="dashboard-right">
                <div className="dashboard">
               
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="accountInfo">
                      <AccountInfo />
                    </TabPane>
                   
                    <TabPane tabId="myOrders">
                    <div className="page-title">
                    <h2>My Orders
                    </h2>
                  </div>    {renderOrders()}
</TabPane>
                    {/* <TabPane tabId="myWishlist">
                      <MyWishlist />
                    </TabPane> */}
                    
                    
                    <TabPane tabId="changePassword">
                      <ChangePassword />
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modal for Editing Information */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editField === "password" ? "Change Password" : "Edit Information"}
        </ModalHeader>
        <ModalBody>
          <Form>
            {editField === "password" && (
              <FormGroup>
                <Label for="password">New Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </FormGroup>
            )}
            {editField === "address" && (
              <>
                <FormGroup>
                  <Label for="billingAddress">Billing Address</Label>
                  <Input
                    type="text"
                    name="billing.address_1"
                    id="billingAddress"
                    value={formData.billing.address_1}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="shippingAddress">Shipping Address</Label>
                  <Input
                    type="text"
                    name="shipping.address_1"
                    id="shippingAddress"
                    value={formData.shipping.address_1}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </>
            )}
            {editField === "contact" && (
              <>
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="bio">Bio</Label>
                  <Input
                    type="textarea"
                    name="bio"
                    id="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleFormSubmit}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </CommonLayout>
  );
};

export default Dashboard;
