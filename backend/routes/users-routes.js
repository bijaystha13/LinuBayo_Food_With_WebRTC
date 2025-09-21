import express from "express";
import dotenv from "dotenv";
import { check } from "express-validator";
import {
  signup,
  login,
  getUserDashboard,
} from "../controllers/users-controllers.js";
import checkAuth from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required"),
    check("phonenumber")
      .isMobilePhone("any")
      .withMessage("Please enter a valid phone number"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  signup
);

router.post("/login", login);

router.use(checkAuth);

router.get("/dashboard", getUserDashboard);

export default router;
