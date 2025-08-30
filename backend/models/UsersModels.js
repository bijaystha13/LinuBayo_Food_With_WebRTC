const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
});

module.exports = mongoose.model("User", userSchema);
