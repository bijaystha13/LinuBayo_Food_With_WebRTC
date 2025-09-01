"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/shared/UIElements/Card";
import styles from "./FoodItem.module.css";
import { FaEye, FaEdit, FaTrashAlt, FaCartPlus, FaBox } from "react-icons/fa";

export default function FoodItem(props) {
  const [isLoading, setIsLoading] = useState(false);
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
        props.onDeleteProduct(props.id); // Fix: Call the delete handler properly
      }
    }
  };

  const handleAddToCart = () => {
    // Handle add to cart logic here
    console.log("Add to cart:", props.id);
  };

  return (
    <li
      className={styles.productItem}
      style={{
        animationDelay: `${props.animationDelay}ms`, // Fix: Apply animation delay
      }}
    >
      <div className={styles.productItemContent}>
        {/* Special Badge (if item is featured/special) */}
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
              // Fallback image if the original fails to load
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

          {/* Quantity */}
          <span className={styles.productItemQuantity}>
            <FaBox style={{ fontSize: "1.1rem" }} />
            Quantity: {props.quantity || 0}
          </span>
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

          {/* Update Button (only show if user has permission) */}
          {props.canEdit && (
            <button
              className={`${styles.btn} ${styles.btnUpdate}`}
              onClick={handleUpdate}
            >
              <FaEdit />
              UPDATE
            </button>
          )}

          {/* Delete Button (only show if user has permission) */}
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
            disabled={!props.quantity || props.quantity <= 0}
          >
            <FaCartPlus />
            ADD TO CART
          </button>
        </div>
      </div>
    </li>
  );
}
