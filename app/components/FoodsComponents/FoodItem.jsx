// FoodItem.js - Complete with Updated Favorite Button
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/app/shared/Context/CartContext";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import { useHttpClient } from "@/app/shared/hooks/http-hook";
import styles from "./FoodItem.module.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaCartPlus,
  FaClock,
  FaStar,
  FaStarHalfAlt,
  FaCheck,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

export default function FoodItem(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [servingCount, setServingCount] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(props.isFavorite || false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const router = useRouter();
  const { addToCart, isInCart, getCartItem } = useCart();
  const authCtx = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const isAdmin = authCtx.isLoggedIn && authCtx.role === "admin";

  const handleViewDetails = async () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/product/${props.id}`);
    }, 300);
  };

  const handleUpdate = () => {
    router.push(`/admin/${props.id}`);
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error("You don't have permission to delete this item");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${props.name}"?`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const responseData = await sendRequest(
        `http://localhost:5001/api/foods/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${authCtx.token}`,
        }
      );

      if (responseData.success) {
        toast.success("Food item deleted successfully!");
        if (props.onDeleteProduct) {
          props.onDeleteProduct(props.id);
        }
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error("Failed to delete food item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!authCtx.isLoggedIn) {
      toast.error("Please login to add favorites");
      router.push("/auth?mode=login");
      return;
    }

    if (authCtx.role === "admin") {
      toast.info("Admins cannot add favorites");
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        const response = await sendRequest(
          `http://localhost:5001/api/users/favorites/${props.id}`,
          "DELETE",
          null,
          { Authorization: `Bearer ${authCtx.token}` }
        );

        if (response?.success) {
          setIsFavorite(false);
          toast.success("Removed from favorites");
        }
      } else {
        const response = await sendRequest(
          `http://localhost:5001/api/users/favorites`,
          "POST",
          JSON.stringify({ itemId: props.id }),
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.token}`,
          }
        );

        if (response?.success) {
          setIsFavorite(true);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      console.error("Favorite error:", error);
      toast.error("Failed to update favorites");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!authCtx.isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (authCtx.role === "admin") {
      toast.info("Admins cannot add items to cart");
      return;
    }

    setIsAddingToCart(true);

    try {
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

      addToCart(productData, servingCount);
      setShowSuccessMessage(true);
      setServingCount(1);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaStar key={i} style={{ opacity: 0.3 }} />);
      }
    }
    return stars;
  };

  const itemInCart = isInCart(props.id);
  const cartItem = getCartItem(props.id);
  const cookTime = props.cookTime || "15-20";
  const rating = props.rating || 0;
  const reviewCount = props.reviewCount || 0;
  const discountPercentage =
    props.originalPrice && props.price
      ? Math.round(
          ((props.originalPrice - props.price) / props.originalPrice) * 100
        )
      : props.discount || 0;

  return (
    <li className={styles.productItem}>
      <div className={styles.productItemContent}>
        {props.isSpecial && <div className={styles.specialBadge}>FEATURED</div>}
        {isAdmin && <div className={styles.adminBadge}>ADMIN VIEW</div>}

        {/* Favorite Button with Custom SVG Heart */}

        {!isAdmin && authCtx.isLoggedIn && (
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className={`${styles.favoriteBtn} ${
              isFavorite ? styles.favorited : ""
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? (
              <FaHeart
                className={favoriteLoading ? styles.pulsing : ""}
                style={{
                  color: "#ec4899",
                  fontSize: "28px",
                  width: "28px",
                  height: "28px",
                }}
              />
            ) : (
              <FaRegHeart
                className={favoriteLoading ? styles.pulsing : ""}
                style={{
                  color: "#ec4899",
                  fontSize: "28px",
                  width: "28px",
                  height: "28px",
                }}
              />
            )}
          </button>
        )}

        {itemInCart && !isAdmin && (
          <div className={styles.cartStatusBadge}>
            <FaCheck />
            In Cart ({cartItem?.quantity})
          </div>
        )}

        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <FaCheck />
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
            <div className={styles.ratingStars}>
              {rating > 0 ? (
                renderStars(rating)
              ) : (
                <>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} style={{ opacity: 0.3 }} />
                  ))}
                </>
              )}
            </div>
            {rating > 0 && reviewCount > 0 && (
              <span className={styles.ratingCount}>
                {rating.toFixed(1)} ({reviewCount})
              </span>
            )}
            {rating === 0 && (
              <span className={styles.ratingCount}>No reviews yet</span>
            )}
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

          {!isAdmin && (
            <div className={styles.servingCounter}>
              <span className={styles.servingLabel}>Servings:</span>
              <div className={styles.counterControls}>
                <button
                  className={styles.counterBtn}
                  onClick={decrementServing}
                  disabled={servingCount <= 1}
                >
                  −
                </button>
                <span className={styles.servingCount}>{servingCount}</span>
                <button
                  className={styles.counterBtn}
                  onClick={incrementServing}
                  disabled={servingCount >= 10}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {itemInCart && !isAdmin && (
            <div className={styles.cartInfo}>
              <span className={styles.cartInfoText}>
                Currently in cart: {cartItem?.quantity} serving(s)
              </span>
            </div>
          )}

          {isAdmin && (
            <div className={styles.adminInfo}>
              <div className={styles.adminInfoItem}>
                <strong>ID:</strong> {props.id}
              </div>
              <div className={styles.adminInfoItem}>
                <strong>Category:</strong> {props.category || "N/A"}
              </div>
              <div className={styles.adminInfoItem}>
                <strong>Quantity:</strong> {props.quantity || 0}
              </div>
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
          >
            <FaEye />
            {isLoading ? "Loading..." : "VIEW DETAILS"}
          </button>

          {isAdmin && (
            <>
              <button
                className={`${styles.btn} ${styles.btnUpdate}`}
                onClick={handleUpdate}
              >
                <FaEdit />
                EDIT PRODUCT
              </button>

              <button
                className={`${styles.btn} ${styles.btnDelete} ${
                  isDeleting ? styles.btnLoading : ""
                }`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <FaTrashAlt />
                {isDeleting ? "DELETING..." : "DELETE PRODUCT"}
              </button>
            </>
          )}

          {!isAdmin && authCtx.isLoggedIn && (
            <button
              className={`${styles.btn} ${styles.btnAddToCart} ${
                isAddingToCart ? styles.btnLoading : ""
              } ${showSuccessMessage ? styles.btnSuccess : ""}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
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
          )}

          {!authCtx.isLoggedIn && (
            <button
              className={`${styles.btn} ${styles.btnAddToCart}`}
              onClick={() => {
                toast.info("Please login to add items to cart");
                router.push("/auth");
              }}
            >
              <FaCartPlus />
              LOGIN TO ADD TO CART
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
