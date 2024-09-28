import React, { useContext } from 'react';
import { Container, Row, Col, Table, Media } from 'reactstrap';
import { WishlistContext } from '../../../../helpers/wishlist/WishlistContext';
import CartContext from '../../../../helpers/cart/index';
import { useRouter } from 'next/router';
import Link from 'next/link';

const WishlistPage = () => {
    const router = useRouter();
    const context = useContext(WishlistContext);
    const cartContext = useContext(CartContext);

    const wishlist = context.wishlistItems;
    const removeFromWish = context.removeFromWish;
    const addCart = cartContext.addToCart;

    const checkOut = () => {
        router.push('/page/account/checkout');
    }

    return (
        <>
            {wishlist.length > 0 ? (
                <section className="wishlist-section section-b-space">
                    <Container>
                        <Row>
                            <Col sm="12">
                                <Table className="table cart-table table-responsive-xs">
                                    <thead>
                                        <tr className="table-head">
                                            <th scope="col">Image</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Availability</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlist.map((item, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <Link href={`/product-details/${item.id}`}>
                                                        <a>
                                                            <Media src={item.images[0].src} alt={item.name} height="80" />
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link href={`/product-details/${item.id}`}>
                                                        <a>{item.name}</a>
                                                    </Link>
                                                   
                                                    <Row className="mobile-cart-content">
                                                        <div className="col-xs-3">
                                                            <p>{item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
                                                        </div>
                                                        <div className="col-xs-3">
                                                            <h2 className="td-color">${item.price}</h2>
                                                        </div>
                                                        <div className="col-xs-3">
                                                            <h2 className="td-color">
                                                                <a href="#" className="icon me-1" onClick={() => removeFromWish(item)}>
                                                                    <i className="fa fa-close"></i>
                                                                </a>
                                                                <a href="#" className="cart" onClick={() => addCart(item)}>
                                                                    <i className="fa fa-shopping-cart"></i>
                                                                </a>
                                                            </h2>
                                                        </div>
                                                    </Row>
                                                </td>
                                                <td>
                                                    <h2>${item.price}</h2>
                                                </td>
                                                <td>
                                                    <p>{item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
                                                </td>
                                                <td>
                                                    <a href="#" className="icon me-3" onClick={() => removeFromWish(item)}>
                                                        <i className="fa fa-times"></i>
                                                    </a>
                                                    <a href="#" className="cart" onClick={() => addCart(item)}>
                                                        <i className="fa fa-shopping-cart"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="wishlist-buttons">
                            <Col sm="12">
                                <Link href={'/shop/left_sidebar'}>
                                    <a className="btn btn-solid">Continue Shopping</a>
                                </Link>
                                <a href="#" className="btn btn-solid" onClick={checkOut}>Check Out</a>
                            </Col>
                        </Row>
                    </Container>
                </section>
            ) : (
                <section className="cart-section section-b-space">
                    <Container>
                        <Row>
                            <Col sm="12">
                                <div>
                                    <div className="col-sm-12 empty-cart-cls text-center">
                                        <Media src="/assets/images/icon-empty-cart.png" className="img-fluid mb-4 mx-auto" alt="" />
                                        <h3>
                                            <strong>Your Wishlist is Empty</strong>
                                        </h3>
                                        <h4>Add some items to your wishlist.</h4>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            )}
        </>
    )
}

export default WishlistPage;