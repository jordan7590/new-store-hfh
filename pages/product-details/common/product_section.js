import React, { useContext, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import ProductItem from "../../../components/common/product-box/ProductBox1";
import PostLoader from "../../../components/common/PostLoader";

const ProductSection = ({ relatedProducts, loading }) => {
  const curContext = useContext(CurrencyContext);
  const wishlistContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const cartContext = useContext(CartContext);
  const symbol = curContext.state.symbol;
  const [quantity, setQuantity] = useState(1);

  console.log("related products:", relatedProducts);

  if (loading) {
    return (
      <section className="section-b-space ratio_asos" style={{background:"#fafafa"}}>
        <Container>
          <Row>
            <Col className="product-related">
              <h2>Related Products</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <PostLoader />
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-b-space ratio_asos" style={{background:"#fafafa"}}>
      <Container>
        <Row>
          <Col className="product-related">
            <h2>Related Products</h2>
          </Col>
        </Row>
        <Row className="search-product">
          <div className="product-wrapper-grid">
            <Row>
              {relatedProducts && relatedProducts.length > 0 ? (
                relatedProducts.map((product, i) => (
                  <Col xl="3" md="4" sm="6" key={product.id}>
                    <div className="product">
                      <ProductItem
                        des={true}
                        product={product}
                        symbol={symbol}
                        backImage={false}
                        cartClass="cart-info cart-wrap"
                        addCompare={() => compareContext.addToCompare(product)}
                        addWishlist={() => wishlistContext.addToWish(product)}
                        addCart={() => cartContext.addToCart(product, quantity)}
                      />
                    </div>
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No related products found.</p>
                </Col>
              )}
            </Row>
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;