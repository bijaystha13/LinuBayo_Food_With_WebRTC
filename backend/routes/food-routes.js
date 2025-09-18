import express from "express";
import fileUpload from "../middleware/file-upload.js";
import {
  getAllFoods,
  getFoodByCategory,
  createFood,
  updateFood,
  deleteFood,
  getFoodById,
  getRelatedFoods,
} from "../controllers/foods-controllers.js";

const router = express.Router();

router.get("/", getAllFoods);

router.get("/:foodId", getFoodById);

router.get("/:foodId/related", getRelatedFoods);

router.get("/category/:category", getFoodByCategory);

router.post("/add", fileUpload.single("image"), createFood);

router.patch("/:foodId", fileUpload.single("image"), updateFood);

router.delete("/:foodId", deleteFood);

export default router;
