import React from "react";
import Banner from "./layouts/Fashion/Components/Banner";
import CollectionBanner from "./layouts/Fashion/Components/Collection-Banner";
import TopCollection from "../components/common/Collections/Collection3";
import Parallax from "./layouts/Fashion/Components/Parallax";
import SpecialProducts from "../components/common/Collections/TabCollection1";
import ServiceLayout from "../components/common/Service/service1";
import Blog from "../components/common/Blog/blog1";
import Instagram from "../components/common/instagram/instagram1";
import LogoBlock from "../components/common/logo-block";
import HeaderOne from "../components/headers/header-one";
import { Product4 } from "../services/script";
import Paragraph from "../components/common/Paragraph";
import ModalComponent from "../components/common/Modal";
import Helmet from "react-helmet";
import MasterFooter from "../components/footers/common/MasterFooter";

const Fashion = () => {
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/x-icon"
          href={"/assets/images/favicon/1.png"}
        />
      </Helmet>
      {/* newsletter */}
      {/* <ModalComponent /> */}
      <HeaderOne logoName={"logo.png"} topClass="top-header" />
      <Banner />

      <div className="hp_brands hp_d-flex-column hp_section hp_z-1">
        <div
          className="hp_component hp_d-flex-column"
          style={{
            boxShadow:
              "0 4px 8px -2px rgba(27, 27, 27, .1), 0 2px 4px -2px rgba(27, 27, 27, .06)",
          }}
        >
          <div className="hp_content hp_d-flex-column">
            <div className="hp_grid hp_justify-content-center hp_wrap">
              <h2 className="hp_h5 hp_text-center hp_text-slate">
                The Most Popular Brands Reside at Hoyt & Company
              </h2>
              <div className="hp_justify-content-between hp_row">
                <div className="hp_align-items-center hp_col-6 hp_col-lg hp_col-md-4 hp_col-xl-auto hp_d-flex hp_justify-content-center hp_position-relative">
                  <a
                    className="hp_stretched-link"
                    href=""
                    aria-labelledby="kn-brd-1"
                  ></a>
                  <img
                    width="100"
                    height="100"
                    src="/assets/images/icon/tnf.jpg"
                    alt="tnf"
                    id="kn-brd-1"
                    loading="lazy"
                  />
                </div>
                <div className="hp_align-items-center hp_col-6 hp_col-lg hp_col-md-4 hp_col-xl-auto hp_d-flex hp_justify-content-center hp_position-relative">
                  <a
                    className="hp_stretched-link"
                    href=""
                    aria-labelledby="kn-brd-2"
                  ></a>
                  <img
                    width="200"
                    height="200"
                    src="/assets/images/icon/eb.jpg"
                    alt="eb"
                    id="kn-brd-2"
                    loading="lazy"
                  />
                </div>
                <div className="hp_align-items-center hp_col-6 hp_col-lg hp_col-md-4 hp_col-xl-auto hp_d-flex hp_justify-content-center hp_position-relative">
                  <a
                    className="hp_stretched-link"
                    href=""
                    aria-labelledby="kn-brd-3"
                  ></a>
                  <img
                    width="110"
                    height="110"
                    src="/assets/images/icon/nike.jpg"
                    alt="nike"
                    id="kn-brd-3"
                    loading="lazy"
                  />
                </div>
                <div className="hp_align-items-center hp_col-6 hp_col-lg hp_col-md-4 hp_col-xl-auto hp_d-flex hp_justify-content-center hp_position-relative">
                  <a
                    className="hp_stretched-link"
                    href=""
                    aria-labelledby="kn-brd-4"
                  ></a>
                  <img
                    width="150"
                    height="150"
                    src="/assets/images/icon/ogio.jpg"
                    alt="ogio"
                    id="kn-brd-4"
                    loading="lazy"
                  />
                </div>
                <div className="hp_align-items-center hp_col-6 hp_col-lg hp_col-md-4 hp_col-xl-auto hp_d-flex hp_justify-content-center hp_position-relative">
                  <a
                    className="hp_stretched-link"
                    href=""
                    aria-labelledby="kn-brd-5"
                  ></a>
                  <img
                    width="80"
                    height="80"
                    src="/assets/images/icon/under-armour.jpg"
                    alt="under-armour"
                    id="kn-brd-5"
                    loading="lazy"
                  />
                </div>
                <div className="hp_align-items-center hp_col-6 hp_col-lg hp_col-md-4 hp_col-xl-auto hp_d-flex hp_justify-content-center hp_position-relative">
                  <a
                    className="hp_stretched-link"
                    href=""
                    aria-labelledby="kn-brd-6"
                  ></a>
                  <img
                    width="180"
                    height="180"
                    src="/assets/images/icon/bella-canvas.jpg"
                    alt="bella-canva"
                    id="kn-brd-6"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hp_category hp_d-flex-column hp_section">
        <div className="hp_component hp_d-flex-column">
          <div className="hp_content hp_d-flex-column">
            <div className="hp_grid hp_justify-content-center hp_wrap">
              <h2 className="hp_h4 hp_text-center hp_text-slate">
                Shop By Category
              </h2>
              <div className="hp_align-items-stretch hp_flex-md-nowrap hp_justify-content-center hp_row hp_row-cols-2 hp_row-cols-md-4 hp_text-center">
                <div className="hp_align-items-center hp_column-content hp_d-flex-column hp_position-relative">
                  <div className="hp_ratio hp_ratio-1x1">
                    <img
                      className="hp_img-fluid hp_rounded-circle"
                      width="360"
                      height="360"
                      src="/assets/images/misc/category1.png"
                      // alt="Variety of shirts"
                    />
                  </div>
                  <a
                    className="hp_btn hp_btn-icon hp_btn-link hp_stretched-link"
                    href=""
                  >
                    T-shirts &amp; Tops
                  </a>
                </div>
                <div className="hp_align-items-center hp_column-content hp_d-flex-column hp_position-relative">
                  <div className="hp_ratio hp_ratio-1x1">
                    <img
                      className="hp_img-fluid hp_rounded-circle"
                      width="360"
                      height="360"
                      src="/assets/images/misc/category2.png"
                      // alt="Variety of sweatshirts and Fleece"
                      
                    />
                  </div>
                  <a
                    className="hp_btn hp_btn-icon hp_btn-link hp_stretched-link hp_text-sm-nowrap hp_text-wrap"
                    href=""
                  >
                    Sweatshirts &amp; Fleece
                  </a>
                </div>
                <div className="hp_align-items-center hp_column-content hp_d-flex-column hp_position-relative">
                  <div className="hp_ratio hp_ratio-1x1">
                    <img
                      className="hp_img-fluid hp_rounded-circle"
                      width="360"
                      height="360"
                      src="/assets/images/misc/category3.png"
                      // alt="Variety of headwear"

                    />
                  </div>
                  <a
                    className="hp_btn hp_btn-icon hp_btn-link hp_stretched-link"
                    href=""
                  >
                    Polos/Knits
                  </a>
                </div>
                <div className="hp_align-items-center hp_column-content hp_d-flex-column hp_position-relative">
                  <div className="hp_ratio hp_ratio-1x1">
                    <img
                      className="hp_img-fluid hp_rounded-circle"
                      width="360"
                      height="360"
                      src="/assets/images/misc/category4.png"
                      // alt="Variety of bags"
                      
                    />
                  </div>
                  <a
                    className="hp_btn hp_btn-icon hp_btn-link hp_stretched-link"
                    href=""
                  >
                    Promotional Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hp_d-flex-column hp_promo hp_section">
        <div className="hp_component hp_d-flex-column">
          <div className="hp_content hp_d-flex-column">
            <div className="hp_grid hp_justify-content-center hp_wrap">
              <h2 className="hp_h4 hp_text-center hp_text-slate">
                You Won’t Want To Miss This!
              </h2>
              <div className="hp_bg-gray-50 hp_promo-card-wrap hp_rounded-5 hp_row">
                <div className="hp_bg-white hp_col-12 hp_col-md hp_d-flex hp_flex-column hp_justify-content-between hp_promo-card hp_rounded-5 hp_shadow-lg">
                  {/* Promo Section */}
                  <div className="hp_col-12 hp_fcc-card-img-wrap hp_position-relative">
                    <div className="hp_h-100 hp_ratio hp_ratio-16x9 hp_ratio-lg-4x3 hp_ratio-md-5x4 hp_ratio-xl-16x9">
                      <img
                        className="hp_img-cover hp_rounded-top-5"
                        width="400"
                        height="300"
                        src="https://cdn.ssactivewear.com/cdn-cgi/image/quality=80,w=400,f=auto/images/sns/home/2024/05-may/3/2574_promo1.jpg"
                        alt="Totes on the beach"
                        data-src="https://cdn.ssactivewear.com/images/sns/home/2024/05-may/3/2574_promo1.jpg?w=400"
                      />
                    </div>
                  </div>
                  <div className="hp_col-12 hp_col-md hp_d-flex hp_flex-column hp_gap-4 hp_promo-cta">
                    <div className="hp_d-flex-column hp_gap-2 hp_h-100">
                      <div className="hp_fw-semibold hp_promo-cta-heading hp_text-rust">
                        Appreciation Gift Ideas
                      </div>
                      <div className="hp_fs-5 hp_fw-medium hp_lh-sm hp_promo-cta-body">
                        Reward your employees from a variety of unique gifts!
                      </div>
                    </div>
                    <div>
                      <a
                        className="hp_btn hp_btn-rust hp_btn-sm hp_stretched-link"
                        href="https://hoytcompany.logomall.com/"
                        id="kn-pro-1"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="hp_bg-white hp_col-12 hp_col-md hp_d-flex hp_flex-column hp_justify-content-between hp_promo-card hp_rounded-5 hp_shadow-lg">
                  <div className="hp_col-12 hp_fcc-card-img-wrap hp_position-relative">
                    <div className="hp_h-100 hp_ratio hp_ratio-16x9 hp_ratio-lg-4x3 hp_ratio-md-5x4 hp_ratio-xl-16x9">
                      <img
                        className="hp_img-cover hp_rounded-top-5"
                        width="400"
                        height="300"
                        src="https://cdn.ssactivewear.com/cdn-cgi/image/quality=80,w=400,f=auto/images/sns/home/2024/05-may/3/2574_promo2.jpg"
                        alt="Model wearing white hat"
                        data-src="https://cdn.ssactivewear.com/images/sns/home/2024/05-may/3/2574_promo2.jpg?w=400"
                      />
                    </div>
                  </div>
                  <div className="hp_col-12 hp_col-md hp_d-flex hp_flex-column hp_gap-4 hp_promo-cta">
                    <div className="hp_d-flex-column hp_gap-2 hp_h-100">
                      <div className="hp_fw-semibold hp_promo-cta-heading hp_text-rust">
                        Site Visits & In-Person Sales
                      </div>
                      <div className="hp_fs-5 hp_fw-medium hp_lh-sm hp_promo-cta-body">
                        View the calendar to see when we will be at your
                        location!
                      </div>
                    </div>
                    <div>
                      <a
                        className="hp_btn hp_btn-rust hp_btn-sm hp_stretched-link"
                        href="#"
                        id="kn-pro-2"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="hp_bg-white hp_col-12 hp_col-md hp_d-flex hp_flex-column hp_justify-content-between hp_promo-card hp_rounded-5 hp_shadow-lg">
                  <div className="hp_col-12 hp_fcc-card-img-wrap hp_position-relative">
                    <div className="hp_h-100 hp_ratio hp_ratio-16x9 hp_ratio-lg-4x3 hp_ratio-md-5x4 hp_ratio-xl-16x9">
                      <img
                        className="hp_img-cover hp_rounded-top-5"
                        width="400"
                        height="300"
                        src="https://cdn.ssactivewear.com/cdn-cgi/image/quality=80,w=400,f=auto/images/sns/home/2024/05-may/3/2574_promo3.jpg"
                        alt="Model wearing bright blue hoodie"
                        data-src="https://cdn.ssactivewear.com/images/sns/home/2024/05-may/3/2574_promo3.jpg?w=400"
                      />
                    </div>
                  </div>
                  <div className="hp_col-12 hp_col-md hp_d-flex hp_flex-column hp_gap-4 hp_promo-cta">
                    <div className="hp_d-flex-column hp_gap-2 hp_h-100">
                      <div className="hp_fw-semibold hp_promo-cta-heading hp_text-rust">
                        On Sale Items
                      </div>
                      <div className="hp_fs-5 hp_fw-medium hp_lh-sm hp_promo-cta-body">
                        Stretch your dollars with these sale-priced items!
                      </div>
                    </div>
                    <div>
                      <a
                        className="hp_btn hp_btn-rust hp_btn-sm hp_stretched-link"
                        href="#"
                        id="kn-pro-3"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hp_d-flex-column hp_resources hp_section">
        <div className="hp_component hp_d-flex-column">
          <div className="hp_content hp_d-flex-column">
            <div className="hp_grid hp_justify-items-center hp_wrap">
              <div className="hp_d-flex-column hp_resources-heading-wrap hp_text-center">
                <h2 className="hp_h4 hp_text-slate">ORDERING RESOURCES</h2>
                <div className="hp_fs-lg hp_lh-sm">
                  Hoyt & Company is here to help your ordering experience{" "}
                </div>
              </div>
              <div className="hp_grid hp_resources-card-wrap">
                <div className="hp_align-items-center hp_d-flex hp_flex-column hp_justify-content-start hp_position-relative hp_resources-card">
                  <img
                    width="139px"
                    height="139px"
                    src="/assets/images/homepage/home-contact-us.png"
                    alt= "Contact Us"
                  />
                  <a
                    className="hp_btn hp_btn-sm hp_btn-tertiary hp_stretched-link"
                    href="/page/contact-us"
                  >
                    Contact Us
                  </a>
                </div>
                <div className="hp_align-items-center hp_d-flex hp_flex-column hp_justify-content-start hp_position-relative hp_resources-card">
                  <img
                    width="139px"
                    height="139px"
                    src="/assets/images/homepage/home-what-we-do.png"
                    alt="What We Do"
                  />
                  <a
                    className="hp_btn hp_btn-sm hp_btn-tertiary hp_stretched-link"
                    href="#"
                  >
                    What We Do
                  </a>
                </div>
                <div className="hp_align-items-center hp_d-flex hp_flex-column hp_justify-content-start hp_position-relative hp_resources-card">
                  <img
                    width="139px"
                    height="139px"
                    src="/assets/images/homepage/home-hfh-standard.png"
                    alt="HFH Brand Standards"
                  />
                  <a
                    className="hp_btn hp_btn-sm hp_btn-tertiary hp_stretched-link"
                    href="#"
                  >
                    HFH Brand Standards{" "}
                  </a>
                </div>
                <div className="hp_align-items-center hp_d-flex hp_flex-column hp_justify-content-start hp_position-relative hp_resources-card">
                  <img
                    width="139px"
                    height="139px"
                    src="/assets/images/homepage/home-faq.png"
                    alt="FAQ"
                  />
                  <a
                    className="hp_btn hp_btn-sm hp_btn-tertiary hp_stretched-link"
                    href="#"
                  >
                    Frequently Asked Questions{" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <CollectionBanner /> */}
      {/* <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
      />
      <TopCollection
        noTitle="null"
        backImage={true}
        type="fashion"
        title="top collection"
        subtitle="special offer"
        productSlider={Product4}
        designClass="section-b-space p-t-0 ratio_asos px-2"
        noSlider="false"
        cartClass="cart-info cart-wrap"
      />
      <Parallax />
      <SpecialProducts
        type="fashion"
        backImage={true}
        productSlider={Product4}
        line={true}
        title="title1 section-t-space"
        inner="title-inner1"
        designClass="section-b-space p-t-0 ratio_asos"
        noSlider="true"
        cartClass="cart-info cart-wrap"
      /> */}

      <ServiceLayout sectionClass="border-section small-section" />
      {/* <Blog type="fashion" title="title1" inner="title-inner1" /> */}
      {/* <Instagram type="fashion" />
      <div className="section-b-space">
        <LogoBlock />
      </div> */}
      <MasterFooter
        footerClass={`footer-black`}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={false}
        logoName={"logo.png"}
      />
    </>
  );
};

export default Fashion;
