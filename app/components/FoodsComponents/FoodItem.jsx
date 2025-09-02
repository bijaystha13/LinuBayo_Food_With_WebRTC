"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/shared/UIElements/Card";
import styles from "./FoodItem.module.css";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaCartPlus,
  FaClock,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

export default function FoodItem(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [servingCount, setServingCount] = useState(1);
  const router = useRouter();

  const handleViewDetails = () => {
    setIsLoading(true);
    router.push(`/product/${props.id}`);
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

  const handleAddToCart = () => {
    console.log("Add to cart:", props.id, "Servings:", servingCount);
  };

  const incrementServing = () => {
    setServingCount((prev) => prev + 1);
  };

  const decrementServing = () => {
    setServingCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Default cook time if not provided
  const cookTime = props.cookTime || "15-20";

  return (
    <li
      className={styles.productItem}
      style={{
        animationDelay: `${props.animationDelay}ms`,
      }}
    >
      <div className={styles.productItemContent}>
        {/* Special Badge */}
        {props.isSpecial && <div className={styles.specialBadge}>FEATURED</div>}

        {/* Image Section */}
        <div className={styles.productItemImage}>
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

        {/* Info Section */}
        <div className={styles.productItemInfo}>
          <h2 className={styles.productItemTitle}>
            {props.name || "Unnamed Item"}
          </h2>

          {/* Prices Section */}
          <div className={styles.productItemPrices}>
            {props.originalPrice && (
              <span className={styles.productItemOriginalPrice}>
                ${props.originalPrice}
              </span>
            )}

            <span className={styles.productItemPrice}>
              ${props.price || "0.00"}
            </span>

            {props.discount && (
              <span className={styles.productItemDiscount}>
                -{props.discount}%
              </span>
            )}
          </div>

          {/* Cook Time */}
          <div className={styles.productItemCookTime}>
            <FaClock className={styles.clockIcon} />
            <span className={styles.cookTimeText}>
              Cook Time: <strong>{cookTime} mins</strong>
            </span>
          </div>

          {/* Serving Counter */}
          <div className={styles.servingCounter}>
            <span className={styles.servingLabel}>Servings:</span>
            <div className={styles.counterControls}>
              <button
                className={styles.counterBtn}
                onClick={decrementServing}
                disabled={servingCount <= 1}
              >
                {/* <FaMinus />  */} -
              </button>
              <span className={styles.servingCount}>{servingCount}</span>
              <button className={styles.counterBtn} onClick={incrementServing}>
                {/* <FaPlus /> */} +
              </button>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
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

          {/* Update Button */}
          {props.canEdit && (
            <button
              className={`${styles.btn} ${styles.btnUpdate}`}
              onClick={handleUpdate}
            >
              <FaEdit />
              UPDATE
            </button>
          )}

          {/* Delete Button */}
          {props.canDelete && (
            <button
              className={`${styles.btn} ${styles.btnDelete}`}
              onClick={handleDelete}
            >
              <FaTrashAlt />
              DELETE
            </button>
          )}

          {/* Add to Cart Button */}
          <button
            className={`${styles.btn} ${styles.btnAddToCart}`}
            onClick={handleAddToCart}
          >
            <FaCartPlus />
            ADD TO CART ({servingCount})
          </button>
        </div>
      </div>
    </li>
  );
}
