import jwt from "jsonwebtoken";
import HttpError from "../models/HttpError.js";

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("No authorization header found");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid authorization format");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token found in authorization header");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret_dont_share"
    );

    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    const error = new HttpError(
      "Authentication failed! Please log in again.",
      401
    );
    return next(error);
  }
};

export default checkAuth;
