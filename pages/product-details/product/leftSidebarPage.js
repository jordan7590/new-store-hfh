import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductTab from '../common/product-tab';
import Service from '../common/service';
import NewProduct from '../../shop/common/newProduct';
import Slider from 'react-slick';
import ImageZoom from '../common/image-zoom';
import DetailsWithPrice from '../common/detail-price';
import Filter from '../common/filter';
import { Container, Row, Col, Media } from 'reactstrap';
import PostLoader from "../../../components/common/PostLoader";
import ProductSection from '../common/product_section';

const LeftSidebarPage = ({ pathId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [variants, setVariants] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productsSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    fade: true,
  };

  const productsNavSliderSettings = {
    slidesToShow: 6,
    swipeToSlide: true,
    arrows: false,
    dots: false,
    focusOnSelect: true,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://hfh.tonserve.com/wp-json/wc/v3/products/${pathId}`, {
          auth: {
            username: 'ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2',
            password: 'cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea'
          }
        });
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [pathId]);


  useEffect(() => {
    // Fetch variants when component mounts
    fetchVariants();
  }, [pathId]);

  const fetchVariants = async () => {
    try {
      const response = await fetch(
        `https://hfh.tonserve.com/wp-json/wc/v3/products/${pathId}/variations?per_page=100`,
        {
          headers: {
            Authorization: "Basic " + btoa("ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2:cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea"),
          },
        }
      );
      const data = await response.json();
      setVariants(data);
      console.log("Variants:", data)
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.related_ids && product.related_ids.length > 0) {
        try {
          const relatedIds = product.related_ids.join(',');
          const response = await axios.get(`https://hfh.tonserve.com/wp-json/wc/v3/products?include=${relatedIds}`, {
            auth: {
              username: 'ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2',
              password: 'cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea'
            }
          });
          setRelatedProducts(response.data);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
    if (slider1.current) {
      slider1.current.slickGoTo(index);
    }
  };

  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, [product, selectedImageIndex]);

  const { nav1, nav2 } = state;

  const filterClick = () => {
    document.getElementById("filter").style.left = "-15px";
  };

  
  const changeColorVar = (selectedColor) => {
    // Find the index of the variant with the selected color
    const index = variants.findIndex(item => item.attributes[1].option === selectedColor);
    
    // If the index is found, navigate the slider to that index
    if (index !== -1 && slider2.current) {
      slider2.current.slickGoTo(index);
      // Trigger a re-render by updating a state variable
      setSelectedImageIndex(index);
    }
  };




  if (loading) {
    return (
      <section className="" style={{background:"#FAFAFA"}}>
      <div className="collection-wrapper">
        <Container>
          <Row>
            <Col lg="12" sm="12" xs="12">
              <Container fluid={true}>
                <Row>
                  <Col lg="4" className="product-thumbnail">
                  <PostLoader />
                  </Col>
                  <Col lg="8" className="rtl-text">
                  <PostLoader />
                  </Col>
                </Row>
              </Container>
              <PostLoader />
            </Col>
          </Row>
        </Container>
      </div>
    </section>
    );
  }

  if (!product || !product.variations || product.variations.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <section className="" style={{background:"#FAFAFA"}}>
      <div className="collection-wrapper">
        <Container>
          <Row>
            {/* <Col sm="3" className="collection-filter" id="filter">
              <Filter />
              <Service />
              <NewProduct />
            </Col> */}
            <Col lg="12" sm="12" xs="12">
              <Container fluid={true}>
                {/* <Row>
                  <Col xl="12" className="filter-col">
                    <div className="filter-main-btn mb-2">
                      <span onClick={filterClick} className="filter-btn">
                        <i className="fa fa-filter" aria-hidden="true"></i> filter
                      </span>
                    </div>
                  </Col>
                </Row> */}
                <Row>
                  <Col lg="4" className="product-thumbnail">
                  <Slider
                        {...productsSliderSettings}
                        asNavFor={nav2}
                        ref={slider1}
                        className="product-slick"
                        beforeChange={(oldIndex, newIndex) => setSelectedImageIndex(newIndex)}
                      >
                        {variants.map((item, index) => (
                          <div key={index}>
                             {item.image && (
                                <Media
                                  src={item.image.src}
                                  alt={`Product image ${index + 1}`}
                                  className="img-fluid"
                                />
                              )}
                          </div>
                        ))}
                      </Slider>
                      <Slider
                            className="slider-nav"
                            {...productsNavSliderSettings}
                            asNavFor={nav1}
                            ref={slider2}
                          >
                         {variants.map((item, index) => (
                            <div key={index} onClick={() => handleImageChange(index)}>
                              {item.image && (
                                <Media
                                  src={item.image.src}
                                  alt={`Product image ${index + 1}`}
                                  className="img-fluid"
                                />
                              )}
                            </div>
                          ))}
                          </Slider>
                  </Col>
                  <Col lg="8" className="rtl-text">
                    <DetailsWithPrice
                      item={product}
                      changeColorVar={changeColorVar}
                      variants={variants}
                    />
                  </Col>
                </Row>
              </Container>
              <ProductTab
                item={product}
              />
            </Col>
          </Row>
        </Container>
        <ProductSection relatedProducts={relatedProducts} />
      </div>
    </section>
    
  );
};

export default LeftSidebarPage;
