import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [accountInfo, setAccountInfo] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editField, setEditField] = useState(''); // To track which field is being edited
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        bio: '',
        password: '',
        billing: {},
        shipping: {},
    });
    const { userData, logout, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/page/account/login');
        } else {
            // Pre-fill form with existing user data
            if (userData) {
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
        }
    }, [isLoggedIn, router, userData]);

    const toggleModal = (field = '') => {
        setEditField(field); // Set the field being edited
        setIsModalOpen(!isModalOpen);
    };

    const handleFormSubmit = async () => {
        try {
            const response = await fetch(`https://hfh.tonserve.com/wp/v2/users/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`, // Assuming you store user token in `userData`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                toggleModal(); // Close modal after successful update
                // Optionally update the frontend state with new user data
            } else {
                toast.error(result.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/page/account/login');
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <CommonLayout parent="home" title="dashboard">
            <section className="section-b-space">
                <Container>
                    <Row>
                        <Col lg="3">
                            {window.innerWidth <= 991 &&
                                <div className="account-sidebar" onClick={() => setAccountInfo(!accountInfo)}>
                                    <a className="popup-btn">my account</a>
                                </div>
                            }
                            <div className="dashboard-left" style={accountInfo ? { left: "0px" } : {}}>
                                <div className="collection-mobile-back" onClick={() => setAccountInfo(!accountInfo)}>
                                    <span className="filter-back">
                                        <i className="fa fa-angle-left" aria-hidden="true"></i> back
                                    </span>
                                </div>
                                <div className="block-content">
                                    <ul>
                                        <li className="active"><a href="#">Account Info</a></li>
                                        <li><a href="#" onClick={() => toggleModal('address')}>Address Book</a></li>
                                        <li><a href="#">My Orders</a></li>
                                        <li><a href="#">My Wishlist</a></li>
                                        <li><a href="#">Newsletter</a></li>
                                        <li><a href="#">My Account</a></li>
                                        <li><a href="#" onClick={() => toggleModal('password')}>Change Password</a></li>
                                        <li className="last"><a href="#" onClick={handleLogout}>Log Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col lg="9">
                            <div className="dashboard-right">
                                <div className="dashboard">
                                    <div className="page-title">
                                        <h2>My Dashboard</h2>
                                    </div>
                                    <div className="welcome-msg">
                                        <p>Hello, {userData.name}!</p>
                                        <p>{userData.bio}</p>
                                    </div>
                                    <div className="box-account box-info">
                                        <div className="box-head">
                                            <h2>Account Information</h2>
                                        </div>
                                        <Row>
                                            <Col sm="6">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Contact Information</h3>
                                                        <a href="#" onClick={() => toggleModal('contact')}>Edit</a>
                                                    </div>
                                                    <div className="box-content">
                                                        <h6>{userData.name}</h6>
                                                        <h6>{userData.woocommerce_data.billing.email}</h6>
                                                        <h6><a href="#" onClick={() => toggleModal('password')}>Change Password</a></h6>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm="6">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Newsletters</h3>
                                                        <a href="#">Edit</a>
                                                    </div>
                                                    <div className="box-content">
                                                        <p>You are currently not subscribed to any newsletter.</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div>
                                            <div className="box">
                                                <div className="box-title">
                                                    <h3>Address Book</h3><a href="#" onClick={() => toggleModal('address')}>Manage Addresses</a>
                                                </div>
                                                <Row>
                                                    <Col sm="6">
                                                        <h6>Default Billing Address</h6>
                                                        <address>
                                                            {userData.woocommerce_data.billing.first_name} {userData.woocommerce_data.billing.last_name}<br />
                                                            {userData.woocommerce_data.billing.company}<br />
                                                            {userData.woocommerce_data.billing.address_1}<br />
                                                            {userData.woocommerce_data.billing.address_2 && `${userData.woocommerce_data.billing.address_2}<br />`}
                                                            {userData.woocommerce_data.billing.city}, {userData.woocommerce_data.billing.state} {userData.woocommerce_data.billing.postcode}<br />
                                                            {userData.woocommerce_data.billing.country}<br />
                                                            Phone: {userData.woocommerce_data.billing.phone}
                                                            <br />
                                                            <a href="#" onClick={() => toggleModal('address')}>Edit Address</a>
                                                        </address>
                                                    </Col>
                                                    <Col sm="6">
                                                        <h6>Default Shipping Address</h6>
                                                        <address>
                                                            {userData.woocommerce_data.shipping.first_name} {userData.woocommerce_data.shipping.last_name}<br />
                                                            {userData.woocommerce_data.shipping.company}<br />
                                                            {userData.woocommerce_data.shipping.address_1}<br />
                                                            {userData.woocommerce_data.shipping.address_2 && `${userData.woocommerce_data.shipping.address_2}<br />`}
                                                            {userData.woocommerce_data.shipping.city}, {userData.woocommerce_data.shipping.state} {userData.woocommerce_data.shipping.postcode}<br />
                                                            {userData.woocommerce_data.shipping.country}<br />
                                                            Phone: {userData.woocommerce_data.shipping.phone}
                                                            <br />
                                                            <a href="#" onClick={() => toggleModal('address')}>Edit Address</a>
                                                        </address>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Modal for Editing Information */}
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>
                    {editField === 'password' ? 'Change Password' : 'Edit Information'}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        {editField === 'password' && (
                            <FormGroup>
                                <Label for="password">New Password</Label>
                                <Input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} />
                            </FormGroup>
                        )}
                        {editField === 'address' && (
                            <>
                                <FormGroup>
                                    <Label for="billingAddress">Billing Address</Label>
                                    <Input type="text" name="billing" id="billingAddress" value={formData.billing.address_1} onChange={handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="shippingAddress">Shipping Address</Label>
                                    <Input type="text" name="shipping" id="shippingAddress" value={formData.shipping.address_1} onChange={handleInputChange} />
                                </FormGroup>
                            </>
                        )}
                        {editField === 'contact' && (
                            <>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="first_name">First Name</Label>
                                    <Input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="last_name">Last Name</Label>
                                    <Input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="bio">Bio</Label>
                                    <Input type="textarea" name="bio" id="bio" value={formData.bio} onChange={handleInputChange} />
                                </FormGroup>
                            </>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleFormSubmit}>Save Changes</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </CommonLayout>
    );
};

export default Dashboard;
