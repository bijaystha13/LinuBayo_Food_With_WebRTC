import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import usersRoutes from "./routes/users-routes.js";
import foodRoutes from "./routes/food-routes.js";
import ratingRoutes from "./routes/rating-routes.js";
import path from "path";
import HttpError from "./models/HttpError.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/users/", usersRoutes);
app.use("/api/foods/", foodRoutes);
app.use("/api/rating/", ratingRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  const code = error.code && typeof error.code === "number" ? error.code : 500;
  res
    .status(code)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(5001);
    console.log("Connected to MongoDB, server running on port 5001");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
