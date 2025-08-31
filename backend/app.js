import dotenv from "dotenv";
dotenv.config();

// const express = require("express");

// const mongoose = require("mongoose");

// const bodyParser = require("body-parser");
// const usersRoutes = require("./routes/users-routes");

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users-routes.js";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(5001);
    console.log("Connected to MongoDB, server running on port 5001");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
