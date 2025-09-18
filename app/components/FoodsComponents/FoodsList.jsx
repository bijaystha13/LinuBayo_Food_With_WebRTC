"use client";
import { useState, useEffect } from "react";
import FoodItem from "@/app/components/FoodsComponents/FoodItem";
import styles from "./FoodsList.module.css";

export default function ProductList(props) {
  const [animationState, setAnimationState] = useState("idle");

  useEffect(() => {
    if (props.items && props.items.length > 0) {
      setAnimationState("animating");

      const totalAnimationTime = Math.max(
        props.items.length * 100 + 1500,
        2500
      );

      const completeTimer = setTimeout(() => {
        setAnimationState("complete");
      }, totalAnimationTime);

      return () => clearTimeout(completeTimer);
    } else {
      setAnimationState("idle");
    }
  }, [props.items]);

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
    <div className={`${styles.productListContainer} ${styles[animationState]}`}>
      <ul className={styles.productList}>
        {props.items.map((item, index) => (
          <div
            key={item._id || item.id || `item-${index}`}
            className={styles.itemWrapper}
            style={{
              "--stagger-delay":
                index > 19 ? `${(index + 1) * 100}ms` : undefined,
            }}
          >
            <FoodItem
              id={item._id || item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              category={item.category}
              quantity={item.quantity}
              originalPrice={item.originalPrice}
              discount={item.discount}
              cookTime={item.cookTime}
              isSpecial={item.isSpecial || false}
              canEdit={props.canEdit || false}
              canDelete={props.canDelete || false}
              onDeleteProduct={props.onDeleteProduct}
            />
          </div>
        ))}
      </ul>

      {animationState === "animating" && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "12px",
            zIndex: 1000,
            display: "none",
          }}
        >
          Animating items... ({props.items.length} items)
        </div>
      )}
    </div>
  );
}
