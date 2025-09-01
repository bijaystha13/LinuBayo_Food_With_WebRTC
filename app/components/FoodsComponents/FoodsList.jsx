"use client";

import { useState, useEffect } from "react";
import Card from "../../shared/UIElements/Card";
import FoodItem from "@/app/components/FoodsComponents/FoodItem";
import styles from "./FoodsList.module.css";

export default function ProductList(props) {
  const [animationState, setAnimationState] = useState("idle");

  // Handle animation state
  useEffect(() => {
    if (props.items && props.items.length > 0) {
      setAnimationState("animating");

      // Animation complete after staggered delay
      const animationDuration = props.items.length * 100 + 500;
      setTimeout(() => {
        setAnimationState("complete");
      }, animationDuration);
    } else {
      setAnimationState("idle");
    }
  }, [props.items]);

  // Show loading state
  if (props.isLoading) {
    return (
      <div className={styles.productListContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading delicious items...</p>
        </div>
      </div>
    );
  }

  // No items found
  if (!props.items || props.items.length === 0) {
    return (
      <div className={styles.productListContainer}>
        <div className={styles.noProductContainer}>
          <div className={styles.noProduct}>
            <span className={styles.noProductIcon}>🍽️</span>
            <p className={styles.noProductText}>
              No Items Found! Please Try Again Later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productListContainer}>
      <ul className={styles.productList}>
        {props.items.map((item, index) => (
          <FoodItem
            key={item._id || item.id || `item-${index}`} // Fix: Use _id first, then id as fallback
            id={item._id || item.id} // Fix: Use _id first, then id as fallback
            name={item.name}
            image={item.image}
            price={item.price}
            category={item.category}
            quantity={item.quantity}
            originalPrice={item.originalPrice}
            discount={item.discount}
            isSpecial={item.isSpecial || false}
            canEdit={props.canEdit || false}
            canDelete={props.canDelete || false}
            onDeleteProduct={props.onDeleteProduct}
            animationDelay={index * 100}
          />
        ))}
      </ul>
    </div>
  );
}
