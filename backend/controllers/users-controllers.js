// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const HttpError = require("../models/HttpError");
// const User = require("../models/UsersModels");

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../models/HttpError.js";
import User from "../models/UsersModels.js";

export async function signup(req, res, next) {
  const { name, email, phonenumber, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exits, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again later.",
      500
    );
    return next(error);
  }

  const createdUser = await User({
    name,
    email,
    phonenumber,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    phonenumber: createdUser.phonenumber,
    message: "User Created",
  });
}
