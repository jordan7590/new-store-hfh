import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Modal, ModalBody, ModalHeader, Media, Input } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import CountdownComponent from "../../../components/common/widgets/countdownComponent";
import MasterSocial from "./master_social";
import { toast } from "react-toastify";

const DetailsWithPrice = ({ item, stickyClass, changeColorVar, variants }) => {
  const [modal, setModal] = useState(false);
  // const [variants, setVariants] = useState([]);
  const CurContect = useContext(CurrencyContext);
  const symbol = CurContect.state.symbol;
  const toggle = () => setModal(!modal);
  const product = item;
  const context = useContext(CartContext);
  const stock = context.stock;
  const plusQty = context.plusQty;
  const minusQty = context.minusQty;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [isInStock, setIsInStock] = useState(false);

  // useEffect(() => {
  //   // Fetch variants when component mounts
  //   fetchVariants();
  // }, []);

  // const fetchVariants = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://tonserve.com/hfh/wp-json/wc/v3/products/${product.id}/variations?per_page=100`,
  //       {
  //         headers: {
  //           Authorization: "Basic " + btoa("ck_86a3fc5979726afb7a1dd66fb12329bef3b365e2:cs_19bb38d1e28e58f10b3ee8829b3cfc182b8eb3ea"),
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     setVariants(data);
  //     console.log("Variants:", variants)
  //   } catch (error) {
  //     console.error("Error fetching variants:", error);
  //   }
  // };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    // console.log("Selected Color:", selectedColor);
    // console.log("Size Quantities:", sizeQuantities);

    for (const size in sizeQuantities) {
      if (sizeQuantities.hasOwnProperty(size)) {
        const quantity = sizeQuantities[size];
        const selectedItem = variants.find(
          (variant) =>
            variant.attributes[0].option === size &&
            variant.attributes[1].option === selectedColor
        );

        // console.log("Size:", size, "Quantity:", quantity, "Selected Item:", selectedItem);

        if (selectedItem && quantity > 0) {
          totalPrice += selectedItem.price * quantity;
        }
      }
    }

    // console.log("Total Price:", totalPrice);

    // Format totalPrice to two decimal places
    return totalPrice.toFixed(2);
  };

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setSelectedColor(selectedColor);
    changeColorVar(selectedColor); // Call changeColorVar with the selected color
    console.log("color selected : ", selectedColor);
  };

  const changeQty = (e) => {
    let value = parseInt(e.target.value);
    if (value < 1) {
      toast.error("Quantity cannot be less than 1.");
      value = 1;
    }
    context.setQuantity(value);
  };

  // Function to check if at least one size has a quantity greater than zero
  const isSizeSelected = () => {
    for (const size in sizeQuantities) {
      if (sizeQuantities.hasOwnProperty(size) && sizeQuantities[size] > 0) {
        return true;
      }
    }
    return false;
  };

  // Update the quantity for a specific size
  const handleSizeQuantityChange = (size, quantity) => {
    const availableStock = getAvailableStock(size);
    const newQuantities = {
      ...sizeQuantities,
      [size]: quantity > availableStock ? availableStock : quantity,
    };
    setSizeQuantities(newQuantities);

    // Log message when user crosses the maximum available stock
    if (quantity > availableStock) {
      // console.log(`User exceeded the maximum available stock for ${size} : ${availableStock}.`);
      toast.error(`Maximum available stock for ${size} :  ${availableStock}.`);
    }
  };

  const renderSizeQuantities = () => {
    const availableSizes = selectedColor
      ? variants
          .filter((variant) => variant.attributes[1].option === selectedColor)
          .map((variant) => variant.attributes[0].option)
      : [];

    return availableSizes.map((size, index) => {
      const availableStock = getAvailableStock(size);
      const maxQuantity = availableStock > 0 ? availableStock : 0;
      const selectedItem = variants.find(
        (variant) =>
          variant.attributes[0].option === size &&
          variant.attributes[1].option === selectedColor
      );

      return (
        <div key={index} className="size-quantity-input">
          <p className="size-box-price">
            {symbol}
            {selectedItem ? selectedItem.price : "-"}
          </p>
          <span className="size-box-span">
            <input
              className="size-box-input"
              type="number"
              min="0"
              max={maxQuantity}
              value={sizeQuantities[size] || ""}
              onChange={(e) =>
                handleSizeQuantityChange(size, parseInt(e.target.value))
              }
              placeholder="0"
            />
          </span>
          <span className="size-box-size-value">{size}</span>
          {/* <span className="size-box-size-value" style={{fontSize:'12px', textAlign: 'center'}}>{availableStock} available</span> */}
        </div>
      );
    });
  };

  const getAvailableStock = (size) => {
    const variant = variants.find(
      (variant) =>
        variant.attributes[0].option === size &&
        variant.attributes[1].option === selectedColor
    );
    return variant ? variant.stock_quantity : 0;
  };

  useEffect(() => {
    // Update available sizes when selectedColor changes
    if (selectedColor) {
      const filteredVariants = variants.filter(
        (variant) => variant.attributes[1].option === selectedColor
      );
      const sizes = filteredVariants.reduce((acc, curr) => {
        if (
          curr.stock_quantity > 0 &&
          !acc.includes(curr.attributes[0].option)
        ) {
          acc.push(curr.attributes[0].option);
        }
        return acc;
      }, []);
      // Set available sizes
      setSizeQuantities({}); // Reset size quanities when color changes

      // Check if any available stock exists
      const totalAvailableStock = filteredVariants.reduce((acc, curr) => {
        return acc + curr.stock_quantity;
      }, 0);
      setIsInStock(totalAvailableStock > 0);
    }
  }, [selectedColor, variants]);

  const uniqueColors = variants.reduce((acc, curr) => {
    if (!acc.includes(curr.attributes[1].option)) {
      acc.push(curr.attributes[1].option);
    }
    return acc;
  }, []);

  const handleAddToCart = () => {
    const selectedSizesQuantities = [];
    const totalPrice = calculateTotalPrice();
    // Iterate through sizeQuantities to gather information about selected sizes and quantities
    for (const size in sizeQuantities) {
      if (sizeQuantities.hasOwnProperty(size) && sizeQuantities[size] > 0) {
        const selectedItem = variants.find(
          (variant) =>
            variant.attributes[0].option === size &&
            variant.attributes[1].option === selectedColor
        );

        if (selectedItem) {
          // Create an object containing size, quantity, and item_number
          const sizeQuantityInfo = {
            size: size,
            quantity: sizeQuantities[size],
            item_number: selectedItem.id,
          };

          // Push the size, quantity, and item_number object to selectedSizesQuantities array
          selectedSizesQuantities.push(sizeQuantityInfo);
        }
      }
    }

    // Call addToCart method in CartContext with the product, selectedColor, and selectedSizesQuantities
    context.addToCart(
      product,
      selectedColor,
      selectedSizesQuantities,
      totalPrice
    );
    console.log(
      "added to cart",
      product,
      selectedColor,
      selectedSizesQuantities,
      totalPrice
    );
  };

  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        <h2>{product.name}</h2>
        {/* <h4>
          <del>
            {symbol}
            {product.price}
          </del>
          <span>{product.discount}% off</span>
        </h4> */}
        <h3>
          {symbol}
          {product.price} <span> /each</span>
          {/* {lowestPrice} - {highestPrice} */}
        </h3>
        {/* Render color dropdown */}
        <div className="product-description border-product customColorSize">
          <h6 className="product-title">
            <span>1</span>Choose your colors :{" "}
          </h6>

          <div className="colorChange">
            {variants.length > 0 && (
              <div className="colorSelect">
                <select value={selectedColor} onChange={handleColorChange}>
                  <option value="">Select Color</option>
                  {uniqueColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Render quantity input */}
        <div className="product-description border-product customColorSize">
          {/* <span className="instock-cls">{stock}</span> */}
          <h6 className="product-title">
            <span>2</span> Select Sizes & Quantities :
            <span className="sizeChart" style={{ float: "right" }}>
              <Link href="/assets/images/default/size-chart.jpg">
                <a data-lng="en" target="_blank">
                  Size Chart
                </a>
              </Link>
            </span>
          </h6>

          <div style={{ display: "flex" }}>{renderSizeQuantities()}</div>
        </div>

        <div className="productFooter">
          <div className="productionTime">
            <div class="primaryTime">Production Time:</div>
            <div class="secondaryTime">Standard - 14 Business Days</div>
          </div>

          <div className="productionTime">
            <div class="primaryTime">Total Price:</div>

            <h6 class="secondaryTime">
              {symbol} {calculateTotalPrice()}
            </h6>
          </div>
          <div className="cartButton">
            {isInStock ? (
              <div className="product-buttons">
                <button
                  className="btn btn-solid"
                  onClick={handleAddToCart} // to call the handleAddToCart function
                  disabled={!isSizeSelected()} // Disable button if no size with quantity selected
                >
                  add to cart
                </button>
              </div>
            ) : (
              <div className="product-buttons">
                <button
                  className="btn btn-solid"
                  disabled
                  style={{
                    padding: "11px 20px 10px 20px",
                    letterSpacing: "3px",
                  }}
                >
                  add to cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsWithPrice;
