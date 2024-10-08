import React, { useEffect, useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import CheckoutPage from './common/checkout-page';
import Login from './login'
import { useAuth } from './AuthContext';

const Checkout = () => {
    const { isLoggedIn, customerID } = useAuth();

    return (
        <>
            {isLoggedIn ?
                <CommonLayout parent="home" title="checkout">
                    <CheckoutPage customerId={customerID} />
                    </CommonLayout>
                :
                <Login redirectTo="/page/account/checkout" />
            }
        </>
    )
}

export default Checkout;