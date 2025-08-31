import Food from "../models/FoodModel.js";
import HttpError from "../models/HttpError.js";

export const createFood = async (req, res, next) => {
  const { name, description, price, quantity, category } = req.body;
  const image = req.file?.path;

  if (!image) {
    return next(new HttpError("No image uploaded.", 422));
  }

  const newFood = new Food({
    name,
    description,
    price,
    quantity,
    category,
    image,
  });

  try {
    await newFood.save();
    res.status(201).json({ message: "Food added", food: newFood });
  } catch (err) {
    return next(new HttpError("Creating food failed, try again.", 500));
  }
};

export async function getFoodByCategory(req, res, next) {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // const products = await Food.find({ category: category.toLowerCase() });
    const products = await Food.find({
      category: { $regex: `^${category}$`, $options: "i" },
    });
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
}
