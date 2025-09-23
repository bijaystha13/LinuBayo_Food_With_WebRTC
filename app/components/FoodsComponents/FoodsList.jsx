"use client";

import { useState, useEffect, useContext } from "react";
import FoodItem from "@/app/components/FoodsComponents/FoodItem";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import styles from "./FoodsList.module.css";

export default function ProductList(props) {
  const [animationState, setAnimationState] = useState("idle");
  const [localItems, setLocalItems] = useState([]);
  const authCtx = useContext(AuthContext);

  // Update local items when props.items changes
  useEffect(() => {
    if (props.items) {
      setLocalItems(props.items);
    }
  }, [props.items]);

  useEffect(() => {
    if (localItems && localItems.length > 0) {
      setAnimationState("animating");

      const totalAnimationTime = Math.max(localItems.length * 100 + 1500, 2500);

      const completeTimer = setTimeout(() => {
        setAnimationState("complete");
      }, totalAnimationTime);

      return () => clearTimeout(completeTimer);
    } else {
      setAnimationState("idle");
    }
  }, [localItems]);

  // Handle delete - update local state and call parent callback
  const handleDeleteFood = (deletedFoodId) => {
    // Update local state immediately for better UX
    setLocalItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== deletedFoodId)
    );

    // Call parent callback if provided
    if (props.onDeleteProduct) {
      props.onDeleteProduct(deletedFoodId);
    }
  };

  // Check if user is admin
  const isAdmin = authCtx.isLoggedIn && authCtx.role === "admin";

  if (props.isLoading) {
    return (
      <div className={styles.productListContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>
            {isAdmin
              ? "Loading food items for management..."
              : "Loading delicious items..."}
          </p>
        </div>
      </div>
    );
  }

  if (!localItems || localItems.length === 0) {
    return (
      <div className={styles.productListContainer}>
        <div className={styles.noProductContainer}>
          <div className={styles.noProduct}>
            <span className={styles.noProductIcon}>🍽️</span>
            <p className={styles.noProductText}>
              {isAdmin
                ? "No food items found! Start by creating some delicious items."
                : "No Items Found! Please Try Again Later!"}
            </p>
            {isAdmin && (
              <div className={styles.adminActions}>
                <button
                  className={styles.createNewBtn}
                  onClick={() => (window.location.href = "/admin/foods/create")}
                >
                  <span className={styles.btnIcon}>➕</span>
                  Create New Food Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.productListContainer} ${styles[animationState]}`}>
      {/* Admin Header */}
      {isAdmin && (
        <div className={styles.adminHeader}>
          <div className={styles.adminHeaderContent}>
            <h3 className={styles.adminTitle}>
              <span className={styles.adminIcon}>👑</span>
              Food Management Dashboard
            </h3>
            <div className={styles.adminStats}>
              <span className={styles.statItem}>
                <strong>{localItems.length}</strong> Items
              </span>
              <span className={styles.statItem}>
                <strong>
                  {localItems.filter((item) => (item.quantity || 0) > 0).length}
                </strong>{" "}
                In Stock
              </span>
              <span className={styles.statItem}>
                <strong>
                  {
                    localItems.filter((item) => (item.quantity || 0) === 0)
                      .length
                  }
                </strong>{" "}
                Out of Stock
              </span>
            </div>
          </div>
        </div>
      )}

      <ul className={styles.productList}>
        {localItems.map((item, index) => (
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
              description={item.description}
              image={item.image}
              price={item.price}
              category={item.category}
              quantity={item.quantity}
              originalPrice={item.originalPrice}
              discount={item.discount}
              cookTime={item.cookTime}
              rating={item.rating}
              reviewCount={item.reviewCount}
              isSpecial={item.isSpecial || false}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              // Pass delete handler - FoodItem will determine if user can delete
              onDeleteProduct={handleDeleteFood}
              // Legacy props for backward compatibility
              canEdit={props.canEdit || false}
              canDelete={props.canDelete || false}
            />
          </div>
        ))}
      </ul>

      {/* Animation Debug Info (hidden by default) */}
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
            display: "none", // Keep hidden unless needed for debugging
          }}
        >
          Animating items... ({localItems.length} items)
        </div>
      )}

      {/* Admin Footer */}
      {isAdmin && localItems.length > 0 && (
        <div className={styles.adminFooter}>
          <div className={styles.adminFooterContent}>
            <p className={styles.adminFooterText}>
              💡 <strong>Admin Tip:</strong> Click on any item to view details,
              use EDIT to modify, or DELETE to remove items.
            </p>
            <button
              className={styles.addNewItemBtn}
              onClick={() => (window.location.href = "/admin/foods/create")}
            >
              <span className={styles.btnIcon}>➕</span>
              Add New Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
