const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users-controllers");

router.post("signup", userControllers.signup);

module.exports = router;
