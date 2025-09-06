// import express from "express";
// import dotenv from "dotenv";

// import { check } from "express-validator";

// import { signup, login } from "../controllers/users-controllers.js";
// import checkAuth from "../middleware/auth.js";
// dotenv.config();

// const router = express.Router();

// router.post(
//   "/signup",
//   [
//     check("name").not().isEmpty().withMessage("Name is required"),
//     check("email")
//       .normalizeEmail()
//       .isEmail()
//       .withMessage("Valid email is required"),
//     check("phonenumber")
//       .isMobilePhone("ne-NP")
//       .withMessage("Please enter a valid 10-digit Nepali phone number"),
//     check("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters long"),
//   ],
//   signup
// );

// router.post("/login", login);

// router.use(checkAuth);

// export default router;

import express from "express";
import dotenv from "dotenv";
import { check } from "express-validator";
import { signup, login } from "../controllers/users-controllers.js";
import checkAuth from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

// Define routes without trailing slashes to avoid path-to-regexp issues
router.post(
  "/signup",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required"),
    check("phonenumber")
      .optional() // Make phone number optional to avoid validation issues
      .isMobilePhone("ne-NP")
      .withMessage("Please enter a valid 10-digit Nepali phone number"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  signup
);

router.post("/login", login);
router.use(checkAuth);

// Apply authentication middleware to protected routes

export default router;
