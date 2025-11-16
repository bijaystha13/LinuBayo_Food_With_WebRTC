import Food from "../models/FoodModel.js";
import HttpError from "../models/HttpError.js";

// Add rating to a food item
export const addRating = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { rating, review } = req.body;
    const { userId, userName } = req.userData; // From auth middleware

    console.log("Adding rating:", { foodId, rating, review, userId, userName });

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return next(new HttpError("Rating must be between 1 and 5", 400));
    }

    if (typeof rating !== "number" && isNaN(Number(rating))) {
      return next(new HttpError("Rating must be a valid number", 400));
    }

    if (review && typeof review !== "string") {
      return next(new HttpError("Review must be a string", 400));
    }

    if (review && review.length > 500) {
      return next(
        new HttpError("Review must be less than 500 characters", 400)
      );
    }

    // Check if food item exists
    const food = await Food.findById(foodId);
    if (!food) {
      return next(new HttpError("Food item not found", 404));
    }

    // Check if user already rated this item
    const existingRatingIndex = food.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );

    const ratingData = {
      userId,
      userName,
      rating: parseInt(rating),
      review: review ? review.trim() : "",
    };

    if (existingRatingIndex !== -1) {
      // Update existing rating
      food.ratings[existingRatingIndex] = {
        ...food.ratings[existingRatingIndex],
        ...ratingData,
        updatedAt: new Date(),
      };
    } else {
      // Add new rating
      food.ratings.push(ratingData);
    }

    // Save will trigger pre-save middleware to calculate average
    await food.save();

    res.status(200).json({
      success: true,
      message:
        existingRatingIndex !== -1
          ? "Rating updated successfully"
          : "Rating added successfully",
      food: {
        id: food._id,
        averageRating: food.averageRating,
        totalRatings: food.totalRatings,
        userRating:
          existingRatingIndex !== -1
            ? food.ratings[existingRatingIndex]
            : food.ratings[food.ratings.length - 1],
      },
    });
  } catch (error) {
    console.error("Error adding/updating rating:", error);

    if (error.name === "CastError") {
      return next(new HttpError("Invalid food ID format", 400));
    }

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(
        new HttpError(`Validation error: ${errorMessages.join(", ")}`, 400)
      );
    }

    return next(new HttpError("Failed to add rating", 500));
  }
};

// Get ratings for a food item with pagination and sorting
export const getFoodRatings = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    console.log("Getting ratings for food:", foodId);

    // Validate foodId
    if (!foodId) {
      return next(new HttpError("Food ID is required", 400));
    }

    const food = await Food.findById(foodId).lean();
    if (!food) {
      return next(new HttpError("Food item not found", 404));
    }

    // Sort ratings
    let sortedRatings = [...food.ratings];

    if (sortBy === "rating") {
      sortedRatings.sort((a, b) => {
        return order === "desc" ? b.rating - a.rating : a.rating - b.rating;
      });
    } else if (sortBy === "createdAt") {
      sortedRatings.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return order === "desc" ? dateB - dateA : dateA - dateB;
      });
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.min(Math.max(1, parseInt(limit)), 50); // Max 50 per page
    const skip = (pageNumber - 1) * pageSize;
    const paginatedRatings = sortedRatings.slice(skip, skip + pageSize);

    const totalPages = Math.ceil(sortedRatings.length / pageSize);

    res.status(200).json({
      success: true,
      ratings: paginatedRatings,
      summary: {
        averageRating: food.averageRating || 0,
        totalRatings: food.totalRatings || 0,
        ratingDistribution: calculateRatingDistribution(food.ratings),
      },
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: sortedRatings.length,
        itemsPerPage: pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);

    if (error.name === "CastError") {
      return next(new HttpError("Invalid food ID format", 400));
    }

    return next(new HttpError("Failed to fetch ratings", 500));
  }
};

// Get user's rating for a specific food item
export const getUserRating = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { userId } = req.userData; // From auth middleware

    console.log("Getting user rating:", { foodId, userId });

    if (!foodId) {
      return next(new HttpError("Food ID is required", 400));
    }

    if (!userId) {
      return next(new HttpError("User ID is required", 400));
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return next(new HttpError("Food item not found", 404));
    }

    const userRating = food.ratings.find((r) => r.userId.toString() === userId);

    res.status(200).json({
      success: true,
      userRating: userRating || null,
      hasRated: !!userRating,
      message: userRating
        ? "User rating found"
        : "User has not rated this item yet",
    });
  } catch (error) {
    console.error("Error fetching user rating:", error);

    if (error.name === "CastError") {
      return next(new HttpError("Invalid food ID format", 400));
    }

    return next(new HttpError("Failed to fetch user rating", 500));
  }
};

// Delete a rating (user can only delete their own)
export const deleteRating = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { userId } = req.userData; // From auth middleware

    console.log("Deleting rating:", { foodId, userId });

    if (!foodId) {
      return next(new HttpError("Food ID is required", 400));
    }

    if (!userId) {
      return next(new HttpError("User ID is required", 400));
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return next(new HttpError("Food item not found", 404));
    }

    const ratingIndex = food.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (ratingIndex === -1) {
      return next(
        new HttpError(
          "Rating not found or you don't have permission to delete this rating",
          404
        )
      );
    }

    // Remove the rating
    food.ratings.splice(ratingIndex, 1);

    // Save will trigger pre-save middleware to recalculate average
    await food.save();

    res.status(200).json({
      success: true,
      message: "Rating deleted successfully",
      food: {
        id: food._id,
        averageRating: food.averageRating,
        totalRatings: food.totalRatings,
      },
    });
  } catch (error) {
    console.error("Error deleting rating:", error);

    if (error.name === "CastError") {
      return next(new HttpError("Invalid food ID format", 400));
    }

    return next(new HttpError("Failed to delete rating", 500));
  }
};

// Helper function to calculate rating distribution
const calculateRatingDistribution = (ratings) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  if (!ratings || ratings.length === 0) {
    return distribution;
  }

  // Count each rating
  ratings.forEach((rating) => {
    const ratingValue = rating.rating;
    if (ratingValue >= 1 && ratingValue <= 5) {
      distribution[ratingValue]++;
    }
  });

  // Convert to percentages
  const total = ratings.length;
  Object.keys(distribution).forEach((star) => {
    distribution[star] =
      total > 0 ? Math.round((distribution[star] / total) * 100) : 0;
  });

  return distribution;
};
