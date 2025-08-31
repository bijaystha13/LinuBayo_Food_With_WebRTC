import mongoose from "mongoose";

const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // this should store a URL or path to the uploaded image
  quantity: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Fast Food", "Dessert"
});

const Food = mongoose.model("Food", foodSchema);

export default Food;
