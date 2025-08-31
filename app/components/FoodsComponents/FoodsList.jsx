"use client";

// components/FoodsList.js
import styles from "./FoodsList.module.css";
import FoodItem from "./FoodItem";

const FoodsList = ({ foods }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Foods</h2>
      <div className={styles.grid}>
        {foods.map((food) => (
          <FoodItem key={food._id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FoodsList;
