import express from "express";
import fileUpload from "../middleware/file-upload.js";
import {
  createFood,
  getFoodByCategory,
  getAllFoods,
  deleteFood,
} from "../controllers/foods-controllers.js";

const router = express.Router();

// GET /api/foods - Get all foods with filtering, sorting, and pagination
router.get("/", getAllFoods);

// GET /api/foods/category/:category - Get foods by specific category
router.get("/category/:category", getFoodByCategory);

// POST /api/foods/add - Create a new food item (with image upload)
router.post("/add", fileUpload.single("image"), createFood);

// DELETE /api/foods/:foodId - Delete a food item
router.delete("/:foodId", deleteFood);

export default router;
