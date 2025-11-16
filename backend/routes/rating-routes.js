import express from "express";
import {
  addRating,
  getFoodRatings,
  deleteRating,
  getUserRating,
} from "../controllers/rating-controllers.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// POST /api/rating/:foodId - Add or update a rating
router.post("/:foodId", authMiddleware, addRating);

// GET /api/rating/:foodId - Get all ratings for a food item
router.get("/:foodId", getFoodRatings);

// GET /api/rating/:foodId/user - Get user's specific rating
router.get("/:foodId/user", authMiddleware, getUserRating);

// DELETE /api/rating/:foodId - Delete user's rating
router.delete("/:foodId", authMiddleware, deleteRating);

export default router;
