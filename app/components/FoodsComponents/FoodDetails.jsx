"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCartPlus,
  FaClock,
  FaTag,
  FaPlus,
  FaMinus,
  FaStar,
  FaHeart,
  FaShare,
  FaUtensils,
  FaLeaf,
  FaFire,
} from "react-icons/fa";
import styles from "./FoodDetails.module.css";

export default function FoodDetails() {
  const { foodId } = useParams();
  const router = useRouter();

  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servingCount, setServingCount] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scroll to top when component mounts or foodId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [foodId]);

  useEffect(() => {
    if (foodId) {
      fetchFoodDetails();
      fetchRelatedFoods();
    }
  }, [foodId]);

  const fetchFoodDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/foods/${foodId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch food details");
      }

      const data = await response.json();
      setFood(data.food);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching food details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedFoods = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/foods/${foodId}/related`
      );

      if (response.ok) {
        const data = await response.json();
        setRelatedFoods(data.relatedFoods || []);
      }
    } catch (err) {
      console.error("Error fetching related foods:", err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", foodId, "Servings:", servingCount);
    // Add your cart logic here
  };

  const incrementServing = () => {
    setServingCount((prev) => prev + 1);
  };

  const decrementServing = () => {
    setServingCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Add favorite logic here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: food?.name,
        text: food?.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRelatedFoodClick = (relatedFoodId) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    router.push(`/product/${relatedFoodId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading food details...</p>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Oops! Something went wrong</h2>
          <p>{error || "Food item not found"}</p>
          <button
            className={`${styles.glassBtn} ${styles.backBtn}`}
            onClick={handleBack}
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const cookTime = food.cookTime || "15-20";
  const rating = food.rating || 4.5;
  const reviewCount = food.reviewCount || 128;

  return (
    <div className={styles.container}>
      {/* Header Actions */}
      <div className={styles.headerActions}>
        <button
          className={`${styles.glassBtn} ${styles.backBtn}`}
          onClick={handleBack}
        >
          <FaArrowLeft />
          <span>Back to Menu</span>
        </button>

        <div className={styles.actionButtons}>
          <button
            className={`${styles.glassBtn} ${styles.actionBtn} ${
              isFavorite ? styles.favoriteActive : ""
            }`}
            onClick={toggleFavorite}
          >
            <FaHeart />
          </button>
          <button
            className={`${styles.glassBtn} ${styles.actionBtn}`}
            onClick={handleShare}
          >
            <FaShare />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {isImageLoading && <div className={styles.imagePlaceholder}></div>}
            <img
              src={
                food.image
                  ? `http://localhost:5001/${food.image}`
                  : "/placeholder-food.jpg"
              }
              alt={food.name}
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                e.target.src = "/placeholder-food.jpg";
                setIsImageLoading(false);
              }}
              style={{ display: isImageLoading ? "none" : "block" }}
            />

            {food.isSpecial && (
              <div className={styles.specialBadge}>
                <FaStar /> FEATURED
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className={styles.detailsSection}>
          <div className={styles.detailsContent}>
            {/* Category Badge */}
            <div className={styles.categoryBadge}>
              <FaTag />
              {food.category}
            </div>

            {/* Title */}
            <h1 className={styles.title}>{food.name}</h1>

            {/* Rating */}
            <div className={styles.rating}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(rating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  />
                ))}
              </div>
              <span className={styles.ratingText}>
                {rating} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>${food.price}</span>
              {food.originalPrice && (
                <span className={styles.originalPrice}>
                  ${food.originalPrice}
                </span>
              )}
              {food.discount && (
                <span className={styles.discount}>-{food.discount}%</span>
              )}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{food.description}</p>
            </div>

            {/* Food Info */}
            <div className={styles.foodInfo}>
              <div className={styles.infoItem}>
                <FaClock className={styles.infoIcon} />
                <span>Cook Time: {cookTime} mins</span>
              </div>
              <div className={styles.infoItem}>
                <FaUtensils className={styles.infoIcon} />
                <span>Category: {food.category}</span>
              </div>
              <div className={styles.infoItem}>
                <FaLeaf className={styles.infoIcon} />
                <span>Fresh Ingredients</span>
              </div>
              <div className={styles.infoItem}>
                <FaFire className={styles.infoIcon} />
                <span>Hot & Delicious</span>
              </div>
            </div>

            {/* Serving Counter & Add to Cart */}
            <div className={styles.orderSection}>
              <div className={styles.servingCounter}>
                <span className={styles.servingLabel}>Servings:</span>
                <div className={styles.counterControls}>
                  <button
                    className={`${styles.glassBtn} ${styles.counterBtn}`}
                    onClick={decrementServing}
                    disabled={servingCount <= 1}
                  >
                    <FaMinus />-
                  </button>
                  <span className={styles.servingCount}>{servingCount}</span>
                  <button
                    className={`${styles.glassBtn} ${styles.counterBtn}`}
                    onClick={incrementServing}
                  >
                    <FaPlus />+
                  </button>
                </div>
              </div>

              <button
                className={`${styles.glassBtn} ${styles.addToCartBtn}`}
                onClick={handleAddToCart}
              >
                <FaCartPlus />
                ADD TO CART ({servingCount}) - $
                {(food.price * servingCount).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Foods Section */}
      {relatedFoods.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>You Might Also Like</h2>
          <div className={styles.relatedGrid}>
            {relatedFoods.map((relatedFood) => (
              <div
                key={relatedFood._id}
                className={styles.relatedItem}
                onClick={() => handleRelatedFoodClick(relatedFood._id)}
              >
                <div className={styles.relatedImage}>
                  <img
                    src={
                      relatedFood.image
                        ? `http://localhost:5001/${relatedFood.image}`
                        : "/placeholder-food.jpg"
                    }
                    alt={relatedFood.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-food.jpg";
                    }}
                  />
                </div>
                <div className={styles.relatedInfo}>
                  <h4>{relatedFood.name}</h4>
                  <p className={styles.relatedPrice}>${relatedFood.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
