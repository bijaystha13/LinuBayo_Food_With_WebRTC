import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Food from "./models/FoodModel.js";

dotenv.config();

const sampleFoods = [
  {
    name: "Cheeseburger",
    description:
      "Juicy grilled beef patty with cheddar cheese, lettuce, tomato, and pickles.",
    price: 8.99,
    image: "boa.jpg",
    quantity: 50,
    category: "Fast Food",
  },
  {
    name: "Margherita Pizza",
    description:
      "Classic pizza with fresh mozzarella, basil, and tomato sauce.",
    price: 12.5,
    image: "Haumea.jpeg",
    quantity: 30,
    category: "Italian",
  },
  {
    name: "Chocolate Cake",
    description: "Rich and moist chocolate cake with a creamy ganache topping.",
    price: 6.0,
    image: "nami.jpeg",
    quantity: 20,
    category: "Dessert",
  },
  {
    name: "Chicken Biryani",
    description:
      "Aromatic basmati rice cooked with tender chicken and Indian spices.",
    price: 10.0,
    image: "nico.jpg",
    quantity: 40,
    category: "Nepali",
  },
];

// Source folder where your original images are stored
const SOURCE_IMAGE_DIR = path.join(process.cwd(), "uploads", "images");

// Destination base folder for categorized images
const UPLOADS_BASE_DIR = path.join(process.cwd(), "uploads", "images");

// Helper function to ensure a folder exists, create if missing
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
};

// Helper function to copy images and prepare food data
const prepareAndCopyImages = () => {
  ensureFolderExists(SOURCE_IMAGE_DIR); // Ensure source folder exists
  return sampleFoods.map((food) => {
    const categoryFolderName = food.category.toLowerCase().replace(/\s+/g, "-");
    const destFolder = path.join(UPLOADS_BASE_DIR, categoryFolderName);
    const sourceImagePath = path.join(SOURCE_IMAGE_DIR, food.image);
    const destImagePath = path.join(destFolder, food.image);

    // Ensure destination category folder exists
    ensureFolderExists(destFolder);

    // Copy the image file if it exists
    if (fs.existsSync(sourceImagePath)) {
      fs.copyFileSync(sourceImagePath, destImagePath);
      console.log(`✅ Copied image ${food.image} to ${destFolder}`);
    } else {
      console.warn(`⚠️ Source image not found: ${sourceImagePath}`);
    }

    // Return the food object with updated image path
    return {
      ...food,
      image: path.relative(process.cwd(), destImagePath).replace(/\\/g, "/"),
    };
  });
};

const preparedFoods = prepareAndCopyImages();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await Food.deleteMany({});
    await Food.insertMany(preparedFoods);
    console.log("✅ Sample food data inserted successfully.");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error inserting sample data:", err);
    mongoose.disconnect();
  });
