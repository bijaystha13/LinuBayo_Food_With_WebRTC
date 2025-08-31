// // const mongoose = require("mongoose");
// import mongoose from "mongoose";

// const uniqueValidator = require("mongoose-unique-validator");

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phonenumber: { type: String, required: true },
//   role: { type: String, default: "user", enum: ["user", "admin"] },
// });

// userSchema.plugin(uniqueValidator);

// module.exports = mongoose.model("User", userSchema);

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

export default User;
