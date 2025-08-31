// const express = require("express");
// const router = express.Router();
// const userControllers = require("../controllers/users-controllers");

// router.post("signup", userControllers.signup);

// module.exports = router;

import express from "express";
import { signup } from "../controllers/users-controllers.js";

const router = express.Router();

router.post("/signup", signup);

export default router;
