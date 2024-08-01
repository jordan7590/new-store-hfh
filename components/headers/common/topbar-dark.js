import React from "react";
import { Media, Container, Row, Col } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../../pages/page/account/AuthContext";
import Cart from "../../containers/Cart";
import CartContainer from "../../containers/CartContainer";
import hfhCartIcon from "../../../public/assets/images/icon/hfh-cart-icon.svg";
import search from "../../../public/assets/images/icon/search.png";

const TopBarDark = ({ topClass, fluid, direction }) => {
  const router = useRouter();
  const { isLoggedIn, userData, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Call logout function when the logout link is clicked
    router.push("/page/account/login");
  };

  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "block";
  };

  return (
    <div className="headerTop">
      <Container fluid={fluid}>
        <Row>
          <Col lg="6">
            <div className="header-contact">
              <ul>
                <li>
                  <i
                    className="fa fa-envelope text-white"
                    aria-hidden="true"
                    style={{ marginRight: "5px" }}
                  ></i>
                  <a href="mailto:sales@hoytcompany.com" className="text-white">
                    sales@hoytcompany.com
                  </a>
                </li>
                <li>
                  {/* <i className="fa fa-phone text-white" aria-hidden="true"></i><a href="tel:+1(810)547-1646" className="text-white">Customer Service: 810.547.1646</a> */}
                  <button className="what-we-offer-button">
                    What We Offer
                    <img
                      src={`/assets/images/icon/angle-arrow-down-white.svg`}
                      alt="White arrow pointing downwards"
                      style={{ height: "10px", margin: "0px 0px 0px 7px" }}
                    />
                  </button>
                </li>
              </ul>
            </div>
          </Col>
          <Col lg="6" className="text-end headerTop-right">
            <div>
              <Media
                src={search.src}
                onClick={openSearch}
                className="img-fluid"
                alt=""
              />
              <i className="fa fa-search" onClick={openSearch}></i>
            </div>

            <div class="hfh-account__divider___vYQzs"></div>
            <ul className="header-dropdown headerTop-account">
              {isLoggedIn ? (
                <>
                  Welcome, {userData.displayName}
                  <img
                    src="/assets/images/icon/angle-arrow-down-white.svg"
                    alt="White arrow pointing downwards"
                    style={{ height: "10px", margin: "0px 0px 0px 7px" }}
                  />
                </>
              ) : (
                <>
                  <li className="">
                    <Link href={`/page/account/login`}>
                      <a>Login</a>
                    </Link>
                  </li>
                  <li className="">
                    <Link href={`/page/account/register`}>
                      <a>Sign Up</a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div class="hfh-account__divider___vYQzs"></div>

            <ul className="header-dropdown headerTop-wishlist">
              <li className="mobile-wishlist">
                <Link href="/page/account/wishlist">
                  <a>
                    <svg
                      class="MuiSvgIcon-root favourite-icon__icon___h5T8e favourite-icon__white___imbHX"
                      focusable="false"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path>
                    </svg>
                  </a>
                </Link>
              </li>
            </ul>
            <div class="hfh-account__divider___vYQzs"></div>

            <ul className="header-dropdown headerTop-wishlist">
              {/*Header Cart Component */}
              {direction === undefined ? (
                // <></>
                <CartContainer layout={direction} icon={hfhCartIcon.src} />
              ) : (
                <Cart layout={direction} icon={hfhCartIcon.src} />
              )}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
