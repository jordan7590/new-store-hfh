import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [accountInfo, setAccountInfo] = useState(false);
    const { userData, logout, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/page/account/login');
        }
    }, [isLoggedIn, router]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/page/account/login');
    };

    if (!userData) {
        return <div>Loading...</div>;
    }else{
        console.log(userData);
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
                            <div className="dashboard-left" style={accountInfo ? {left:"0px"} : {}}> 
                                <div className="collection-mobile-back" onClick={() => setAccountInfo(!accountInfo)}>
                                    <span className="filter-back">
                                        <i className="fa fa-angle-left" aria-hidden="true"></i> back
                                    </span>
                                </div>
                                <div className="block-content">
                                    <ul>
                                        <li className="active"><a href="#">Account Info</a></li>
                                        <li><a href="#">Address Book</a></li>
                                        <li><a href="#">My Orders</a></li>
                                        <li><a href="#">My Wishlist</a></li>
                                        <li><a href="#">Newsletter</a></li>
                                        <li><a href="#">My Account</a></li>
                                        <li><a href="#">Change Password</a></li>
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
                                                        <h3>Contact Information</h3><a href="#">Edit</a>
                                                    </div>
                                                    <div className="box-content">
                                                        <h6>{userData.name}</h6>
                                                        <h6>{userData.woocommerce_data.billing.email}</h6>
                                                        <h6><a href="#">Change Password</a></h6>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm="6">
                                                <div className="box">
                                                    <div className="box-title">
                                                        <h3>Newsletters</h3><a href="#">Edit</a>
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
                                                    <h3>Address Book</h3><a href="#">Manage Addresses</a>
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
                                                            <a href="#">Edit Address</a>
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
                                                            <a href="#">Edit Address</a>
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
        </CommonLayout>
    )
}

export default Dashboard;