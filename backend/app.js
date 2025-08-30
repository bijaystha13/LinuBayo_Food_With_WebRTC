const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users-routes");

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
  .connect(
    "mongodb+srv://thelordshadow13:6YZfKhyEGtWgTuBa@cluster0.r5vq2sl.mongodb.net/food?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5001);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("Not Connected");
  });
