"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import { useHttpClient } from "@/app/shared/hooks/http-hook";
import { toast } from "react-toastify";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaTimes,
  FaComment,
  FaHeart,
} from "react-icons/fa";
import styles from "./Rating.module.css";

const RatingComponent = ({
  foodId,
  initialRating = 0,
  initialCount = 0,
  showInline = true,
  size = "normal",
}) => {
  const [averageRating, setAverageRating] = useState(initialRating);
  const [totalRatings, setTotalRatings] = useState(initialCount);
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // New state for inline quick rating
  const [isQuickRating, setIsQuickRating] = useState(false);
  const [quickRatingHover, setQuickRatingHover] = useState(0);

  const authCtx = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const API_BASE = "http://localhost:5001";

  // Fetch user's existing rating
  useEffect(() => {
    if (authCtx.isLoggedIn && authCtx.role !== "admin") {
      fetchUserRating();
    }
  }, [foodId, authCtx.isLoggedIn]);

  const fetchUserRating = async () => {
    if (!foodId) {
      console.log("No foodId provided");
      return;
    }

    try {
      const response = await sendRequest(
        `${API_BASE}/api/rating/${foodId}/user`,
        "GET",
        null,
        { Authorization: `Bearer ${authCtx.token}` }
      );

      if (response.success && response.userRating) {
        setUserRating(response.userRating);
        setSelectedRating(response.userRating.rating);
        setReview(response.userRating.review || "");
      }
    } catch (error) {
      console.log("No existing rating found");
    }
  };

  const fetchAllRatings = async () => {
    if (!foodId) {
      console.log("No foodId provided for fetching ratings");
      return;
    }

    setIsLoadingRatings(true);
    try {
      const response = await sendRequest(
        `${API_BASE}/api/rating/${foodId}?limit=20&sortBy=createdAt`
      );

      if (response.success) {
        setRatings(response.ratings);
        setRatingDistribution(response.summary.ratingDistribution);
        setAverageRating(response.summary.averageRating);
        setTotalRatings(response.summary.totalRatings);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoadingRatings(false);
    }
  };

  // Quick rating submission (without review)
  const handleQuickRating = async (rating) => {
    if (!authCtx.isLoggedIn) {
      toast.error("Please login to rate this item");
      return;
    }

    if (authCtx.role === "admin") {
      toast.info("Admins cannot rate items");
      return;
    }

    if (!foodId) {
      toast.error("Food ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendRequest(
        `${API_BASE}/api/foods/${foodId}/rating`,
        "POST",
        JSON.stringify({
          rating: rating,
          review: userRating?.review || "",
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        }
      );

      if (response.success) {
        setUserRating(response.food.userRating);
        setAverageRating(response.food.averageRating);
        setTotalRatings(response.food.totalRatings);
        setSelectedRating(rating);
        setIsQuickRating(false);
        toast.success("Rating updated!");

        if (showAllRatings) {
          fetchAllRatings();
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = () => {
    if (!authCtx.isLoggedIn) {
      toast.error("Please login to rate this item");
      return;
    }

    if (authCtx.role === "admin") {
      toast.info("Admins cannot rate items");
      return;
    }

    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendRequest(
        `${API_BASE}/api/foods/${foodId}/rating`,
        "POST",
        JSON.stringify({
          rating: selectedRating,
          review: review.trim(),
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        }
      );

      if (response.success) {
        setUserRating(response.food.userRating);
        setAverageRating(response.food.averageRating);
        setTotalRatings(response.food.totalRatings);
        setShowRatingModal(false);
        toast.success(response.message);

        if (showAllRatings) {
          fetchAllRatings();
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!window.confirm("Are you sure you want to delete your rating?")) {
      return;
    }

    try {
      const response = await sendRequest(
        `${API_BASE}/api/foods/${foodId}/rating`,
        "DELETE",
        null,
        { Authorization: `Bearer ${authCtx.token}` }
      );

      if (response.success) {
        setUserRating(null);
        setSelectedRating(0);
        setReview("");
        setAverageRating(response.food.averageRating);
        setTotalRatings(response.food.totalRatings);
        toast.success("Rating deleted successfully");

        if (showAllRatings) {
          fetchAllRatings();
        }
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
    }
  };

  const renderStars = (
    rating,
    interactive = false,
    starSize = "normal",
    isQuick = false
  ) => {
    const stars = [];
    const displayRating = interactive
      ? isQuick
        ? quickRatingHover
        : hoverRating || selectedRating
      : rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      const isPartial = !interactive && rating > i - 1 && rating < i;

      stars.push(
        <div
          key={i}
          className={`${styles.starContainer} ${
            interactive ? styles.starInteractive : ""
          } ${styles[`star${starSize}`]}`}
          onClick={
            interactive
              ? () => {
                  if (isQuick) {
                    handleQuickRating(i);
                  } else {
                    setSelectedRating(i);
                  }
                }
              : undefined
          }
          onMouseEnter={
            interactive
              ? () => {
                  if (isQuick) {
                    setQuickRatingHover(i);
                  } else {
                    setHoverRating(i);
                  }
                }
              : undefined
          }
          onMouseLeave={
            interactive
              ? () => {
                  if (isQuick) {
                    setQuickRatingHover(0);
                  } else {
                    setHoverRating(0);
                  }
                }
              : undefined
          }
        >
          <FaStar
            className={`${styles.star} ${
              isFilled ? styles.starFilled : styles.starEmpty
            }`}
          />
          {interactive && <div className={styles.starGlow}></div>}
        </div>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const closeModal = () => {
    setShowRatingModal(false);
    setHoverRating(0);
    if (userRating) {
      setSelectedRating(userRating.rating);
      setReview(userRating.review || "");
    } else {
      setSelectedRating(0);
      setReview("");
    }
  };

  return (
    <div className={`${styles.ratingContainer} ${styles[size]}`}>
      {/* Main Rating Display */}
      <div className={styles.ratingDisplay}>
        {averageRating > 0 ? (
          <>
            <div className={styles.ratingStars}>
              {renderStars(averageRating, false, size)}
            </div>
            <div className={styles.ratingInfo}>
              <span className={styles.ratingValue}>
                {averageRating.toFixed(1)}
              </span>
              <span className={styles.ratingText}>
                ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
              </span>
            </div>
          </>
        ) : (
          <div className={styles.noRatingDisplay}>
            <div className={styles.ratingStars}>
              {renderStars(0, false, size)}
            </div>
            <div className={styles.ratingInfo}>
              <span className={styles.ratingText}>No reviews yet</span>
            </div>
          </div>
        )}

        {/* Quick Rating for logged-in users */}
        {authCtx.isLoggedIn && authCtx.role !== "admin" && showInline && (
          <div className={styles.quickRatingContainer}>
            {!isQuickRating ? (
              <button
                className={`${styles.glassButton} ${styles.quickRateButton}`}
                onClick={() => setIsQuickRating(true)}
                disabled={isSubmitting}
              >
                <FaHeart className={styles.buttonIcon} />
                {userRating ? "Update" : "Rate"}
              </button>
            ) : (
              <div
                className={`${styles.glassContainer} ${styles.quickRatingStars}`}
              >
                <span className={styles.quickRatingLabel}>Rate:</span>
                <div className={styles.interactiveStarsQuick}>
                  {renderStars(userRating?.rating || 0, true, size, true)}
                </div>
                <button
                  className={`${styles.glassButton} ${styles.cancelQuickRating}`}
                  onClick={() => {
                    setIsQuickRating(false);
                    setQuickRatingHover(0);
                  }}
                  disabled={isSubmitting}
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User's Rating Status */}
      {userRating && authCtx.isLoggedIn && authCtx.role !== "admin" && (
        <div className={`${styles.glassContainer} ${styles.userRatingStatus}`}>
          <div className={styles.userRatingInfo}>
            <span className={styles.userRatingLabel}>Your rating:</span>
            <div className={styles.userRatingStars}>
              {renderStars(userRating.rating, false, "small")}
            </div>
            <span className={styles.userRatingValue}>
              ({userRating.rating}/5)
            </span>
            {userRating.review && (
              <span
                className={styles.hasReviewIndicator}
                title={userRating.review}
              >
                <FaComment />
              </span>
            )}
          </div>
          <div className={styles.userRatingActions}>
            <button
              className={`${styles.glassButton} ${styles.editRatingButton}`}
              onClick={() => setShowRatingModal(true)}
              title="Edit your rating and review"
            >
              <FaEdit />
            </button>
            <button
              className={`${styles.glassButton} ${styles.deleteRatingButton}`}
              onClick={handleDeleteRating}
              title="Delete your rating"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.ratingActions}>
        {authCtx.isLoggedIn && authCtx.role !== "admin" && (
          <button
            className={`${styles.glassButton} ${styles.fullRateButton}`}
            onClick={handleRatingClick}
          >
            <FaComment className={styles.buttonIcon} />
            {userRating ? "Edit Review" : "Write Review"}
          </button>
        )}

        {totalRatings > 0 && (
          <button
            className={`${styles.glassButton} ${styles.viewAllButton}`}
            onClick={() => {
              setShowAllRatings(!showAllRatings);
              if (!showAllRatings && ratings.length === 0) {
                fetchAllRatings();
              }
            }}
          >
            <FaStar className={styles.buttonIcon} />
            {showAllRatings ? "Hide Reviews" : "View All Reviews"}
          </button>
        )}
      </div>

      {/* All Ratings Display */}
      {showAllRatings && (
        <div
          className={`${styles.glassContainer} ${styles.allRatingsContainer}`}
        >
          <div className={styles.ratingSummary}>
            <h4>Customer Reviews</h4>

            {/* Rating Distribution */}
            <div className={styles.ratingDistribution}>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className={styles.distributionRow}>
                  <span className={styles.starNumber}>{star}</span>
                  <FaStar className={styles.distributionStar} />
                  <div className={styles.distributionBar}>
                    <div
                      className={styles.distributionFill}
                      style={{ width: `${ratingDistribution[star]}%` }}
                    ></div>
                  </div>
                  <span className={styles.distributionPercentage}>
                    {ratingDistribution[star]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isLoadingRatings ? (
            <div className={styles.loadingRatings}>
              <div className={styles.loadingSpinner}></div>
              Loading reviews...
            </div>
          ) : (
            <div className={styles.ratingsList}>
              {ratings.map((rating) => (
                <div
                  key={rating._id}
                  className={`${styles.glassContainer} ${styles.ratingItem}`}
                >
                  <div className={styles.ratingHeader}>
                    <div className={styles.ratingUser}>
                      <span className={styles.userName}>{rating.userName}</span>
                      <div className={styles.ratingStars}>
                        {renderStars(rating.rating, false, "small")}
                      </div>
                    </div>
                    <span className={styles.ratingDate}>
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>
                  {rating.review && (
                    <p className={styles.ratingReview}>{rating.review}</p>
                  )}
                </div>
              ))}

              {ratings.length === 0 && (
                <div className={styles.noRatings}>
                  No reviews available yet.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className={`${styles.glassContainer} ${styles.modalContent}`}>
            <div className={styles.modalHeader}>
              <h3>
                {userRating ? "Edit Your Rating & Review" : "Rate This Item"}
              </h3>
              <button
                className={`${styles.glassButton} ${styles.closeButton}`}
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.ratingSelector}>
                <p>Select your rating:</p>
                <div className={styles.interactiveStars}>
                  {renderStars(selectedRating, true, "large")}
                </div>
                {selectedRating > 0 && (
                  <span className={styles.ratingValue}>
                    {selectedRating} out of 5 stars
                  </span>
                )}
              </div>

              <div className={styles.reviewInput}>
                <label htmlFor="review">Write a review (optional):</label>
                <div className={styles.textareaContainer}>
                  <textarea
                    id="review"
                    className={styles.glassTextarea}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this item..."
                    maxLength="500"
                    rows="4"
                  />
                  <div className={styles.textareaGlow}></div>
                </div>
                <span className={styles.charCount}>
                  {review.length}/500 characters
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={`${styles.glassButton} ${styles.cancelButton}`}
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={`${styles.glassButton} ${styles.submitButton}`}
                onClick={handleSubmitRating}
                disabled={isSubmitting || selectedRating === 0}
              >
                {isSubmitting && <div className={styles.buttonSpinner}></div>}
                {isSubmitting
                  ? "Submitting..."
                  : userRating
                  ? "Update Rating"
                  : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay for quick rating */}
      {isSubmitting && isQuickRating && (
        <div className={styles.quickRatingLoading}>
          <div className={styles.loadingSpinner}></div>
          Updating rating...
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
