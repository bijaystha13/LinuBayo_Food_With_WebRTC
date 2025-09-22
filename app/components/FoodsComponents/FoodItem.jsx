"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/shared/Context/CartContext"; // Adjust path as needed
import styles from "./FoodItem.module.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaCartPlus,
  FaClock,
  FaPlus,
  FaMinus,
  FaStar,
  FaStarHalfAlt,
  FaCheck,
} from "react-icons/fa";

export default function FoodItem(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [servingCount, setServingCount] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  const { addToCart, isInCart, getCartItem } = useCart();

  const handleViewDetails = async () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/product/${props.id}`);
    }, 300);
  };

  const handleUpdate = () => {
    router.push(`/product/edit/${props.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      if (props.onDeleteProduct) {
        props.onDeleteProduct(props.id);
      }
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      // Create product object with all necessary properties
      const productData = {
        id: props.id,
        name: props.name,
        description: props.description,
        price: props.price,
        image: props.image,
        restaurant: props.restaurant,
        cookTime: props.cookTime,
        rating: props.rating,
        reviewCount: props.reviewCount,
      };

      // Add to cart with selected quantity
      addToCart(productData, servingCount);

      // Show success message
      setShowSuccessMessage(true);

      // Reset serving count
      setServingCount(1);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

      console.log(`Added ${servingCount} serving(s) of ${props.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    }
  };

  const incrementServing = () => {
    setServingCount((prev) => Math.min(prev + 1, 10));
  };

  const decrementServing = () => {
    setServingCount((prev) => Math.max(prev - 1, 1));
  };

  const cookTime = props.cookTime || "15-20";
  const rating = props.rating || 4.5;
  const reviewCount = props.reviewCount || 124;

  const discountPercentage =
    props.originalPrice && props.price
      ? Math.round(
          ((props.originalPrice - props.price) / props.originalPrice) * 100
        )
      : props.discount || 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    return stars;
  };

  // Check if item is already in cart
  const itemInCart = isInCart(props.id);
  const cartItem = getCartItem(props.id);

  return (
    <li className={styles.productItem}>
      <div className={styles.productItemContent}>
        {props.isSpecial && <div className={styles.specialBadge}>FEATURED</div>}

        {/* Cart Status Indicator */}
        {itemInCart && (
          <div className={styles.cartStatusBadge}>
            <FaCheck className={styles.cartCheckIcon} />
            In Cart ({cartItem?.quantity})
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <FaCheck className={styles.successIcon} />
            Added to cart!
          </div>
        )}

        <div className={styles.productItemImage}>
          <div className={styles.imageContainer}>
            <img
              src={
                props.image
                  ? `http://localhost:5001/${props.image}`
                  : "/placeholder-food.jpg"
              }
              alt={props.name || "Food Item"}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/placeholder-food.jpg";
              }}
            />
          </div>
        </div>

        <div className={styles.productItemInfo}>
          <h2 className={styles.productItemTitle}>
            {props.name || "Unnamed Item"}
          </h2>

          <div className={styles.rating}>
            <div className={styles.ratingStars}>{renderStars(rating)}</div>
            <span className={styles.ratingCount}>({reviewCount})</span>
          </div>

          <div className={styles.productItemPrices}>
            {props.originalPrice && (
              <span className={styles.productItemOriginalPrice}>
                ${parseFloat(props.originalPrice).toFixed(2)}
              </span>
            )}

            <span className={styles.productItemPrice}>
              ${parseFloat(props.price || 0).toFixed(2)}
            </span>

            {discountPercentage > 0 && (
              <span className={styles.productItemDiscount}>
                -{discountPercentage}%
              </span>
            )}
          </div>

          <div className={styles.productItemCookTime}>
            <FaClock className={styles.clockIcon} />
            <span className={styles.cookTimeText}>
              <strong>{cookTime} mins</strong>
            </span>
          </div>

          <div className={styles.servingCounter}>
            <span className={styles.servingLabel}>Servings:</span>
            <div className={styles.counterControls}>
              <button
                className={styles.counterBtn}
                onClick={decrementServing}
                disabled={servingCount <= 1}
                aria-label="Decrease servings"
              >
                <FaMinus /> -
              </button>
              <span className={styles.servingCount}>{servingCount}</span>
              <button
                className={styles.counterBtn}
                onClick={incrementServing}
                disabled={servingCount >= 10}
                aria-label="Increase servings"
              >
                <FaPlus /> +
              </button>
            </div>
          </div>

          {/* Show current cart quantity if item is in cart */}
          {itemInCart && (
            <div className={styles.cartInfo}>
              <span className={styles.cartInfoText}>
                Currently in cart: {cartItem?.quantity} serving(s)
              </span>
            </div>
          )}
        </div>

        <div className={styles.productItemButtons}>
          <button
            className={`${styles.btn} ${styles.btnView} ${
              isLoading ? styles.btnLoading : ""
            }`}
            onClick={handleViewDetails}
            disabled={isLoading}
            aria-label="View product details"
          >
            <FaEye />
            {isLoading ? "Loading..." : "VIEW DETAILS"}
          </button>

          {props.canEdit && (
            <button
              className={`${styles.btn} ${styles.btnUpdate}`}
              onClick={handleUpdate}
              aria-label="Edit product"
            >
              <FaEdit />
              UPDATE
            </button>
          )}

          {props.canDelete && (
            <button
              className={`${styles.btn} ${styles.btnDelete}`}
              onClick={handleDelete}
              aria-label="Delete product"
            >
              <FaTrashAlt />
              DELETE
            </button>
          )}

          <button
            className={`${styles.btn} ${styles.btnAddToCart} ${
              isAddingToCart ? styles.btnLoading : ""
            } ${showSuccessMessage ? styles.btnSuccess : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`Add ${servingCount} serving${
              servingCount > 1 ? "s" : ""
            } to cart`}
          >
            {showSuccessMessage ? (
              <>
                <FaCheck />
                ADDED TO CART!
              </>
            ) : isAddingToCart ? (
              "ADDING..."
            ) : (
              <>
                <FaCartPlus />
                {itemInCart ? "ADD MORE" : "ADD TO CART"} ({servingCount})
              </>
            )}
          </button>
        </div>
      </div>
    </li>
  );
}
