"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminCreateFoodPage.module.css";
import AdminCreateFood from "@/app/components/Admin/AdminCreateFood";

const AdminCreateFoodPage = () => {
  const router = useRouter();
  const [recentlyCreated, setRecentlyCreated] = useState([]);

  const handleFoodCreated = (newFood) => {
    // Add to recently created list
    setRecentlyCreated((prev) => [newFood, ...prev.slice(0, 4)]);
  };

  const handleViewMenu = () => {
    router.push("/menu");
  };

  const handleViewAllFoods = () => {
    router.push("/admin/foods");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
      </div>

      <div className={styles.pageContent}>
        {/* Header Section */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Create and manage your restaurant's delicious offerings
          </p>

          <div className={styles.actionButtons}>
            <button onClick={handleViewMenu} className={styles.actionBtn}>
              View Public Menu
            </button>
            <button onClick={handleViewAllFoods} className={styles.actionBtn}>
              Manage All Foods
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Create Food Form */}
          <div className={styles.formSection}>
            <AdminCreateFood onFoodCreated={handleFoodCreated} />
          </div>

          {/* Recently Created Items */}
          {recentlyCreated.length > 0 && (
            <div className={styles.recentSection}>
              <div className={styles.recentHeader}>
                <h3 className={styles.recentTitle}>Recently Created</h3>
                <p className={styles.recentSubtitle}>
                  Your latest food additions
                </p>
              </div>

              <div className={styles.recentGrid}>
                {recentlyCreated.map((food) => (
                  <div key={food.id} className={styles.recentCard}>
                    <div className={styles.cardImage}>
                      <img
                        src={`http://localhost:5001/${food.image}`}
                        alt={food.name}
                        className={styles.foodImage}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <h4 className={styles.foodName}>{food.name}</h4>
                      <p className={styles.foodCategory}>
                        {food.category.charAt(0).toUpperCase() +
                          food.category.slice(1)}
                      </p>
                      <p className={styles.foodPrice}>
                        ${food.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <h4 className={styles.statTitle}>Total Items</h4>
              <p className={styles.statValue}>View Analytics</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <h4 className={styles.statTitle}>Popular Items</h4>
              <p className={styles.statValue}>View Reports</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statInfo}>
              <h4 className={styles.statTitle}>Sales Trends</h4>
              <p className={styles.statValue}>View Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateFoodPage;
