// routes/food-routes.js

import express from "express";
import fileUpload from "../middleware/file-upload.js";
import {
  createFood,
  getFoodByCategory,
} from "../controllers/foods-controllers.js";

const router = express.Router();

router.post("/add", fileUpload.single("image"), createFood);
router.get("/:category", getFoodByCategory);

export default router;
