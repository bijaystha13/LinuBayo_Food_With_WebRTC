import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpError from "../models/HttpError.js";

dotenv.config();

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Authentication Failed!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed", 403);
    return next(error);
  }
};

export default checkAuth;
