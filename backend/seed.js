import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Food from "./models/FoodModel.js";

dotenv.config();

const sampleFoods = [
  // Fast Food
  {
    name: "Cheeseburger",
    description:
      "Juicy grilled beef patty with cheddar cheese, lettuce, tomato, and pickles.",
    price: 8.99,
    image: "cheeseburger.jpg",
    quantity: 50,
    category: "Fast Food",
  },
  {
    name: "Chicken Wings",
    description:
      "Crispy buffalo chicken wings served with celery and blue cheese dip.",
    price: 9.99,
    image: "chicken_wings.jpg",
    quantity: 40,
    category: "Fast Food",
  },
  {
    name: "Fish & Chips",
    description: "Beer-battered cod served with golden fries and tartar sauce.",
    price: 11.5,
    image: "fish_chips.jpg",
    quantity: 25,
    category: "Fast Food",
  },
  {
    name: "Hotdog",
    description:
      "Grilled beef frankfurter in a toasted bun with mustard and ketchup.",
    price: 5.99,
    image: "hotdog.jpg",
    quantity: 60,
    category: "Fast Food",
  },
  //
  {
    name: "Boa Hancock",
    description:
      "Juicy grilled beef patty with cheddar cheese, lettuce, tomato, and pickles.",
    price: 8.99,
    image: "boa.jpg",
    quantity: 50,
    category: "Fast Food",
  },
  {
    name: "Nami",
    description:
      "Crispy buffalo chicken wings served with celery and blue cheese dip.",
    price: 9.99,
    image: "nami.jpeg",
    quantity: 40,
    category: "Fast Food",
  },
  {
    name: "Nico Robin",
    description: "Beer-battered cod served with golden fries and tartar sauce.",
    price: 11.5,
    image: "nico.jpg",
    quantity: 25,
    category: "Fast Food",
  },
  {
    name: "Alya",
    description:
      "Grilled beef frankfurter in a toasted bun with mustard and ketchup.",
    price: 5.99,
    image: "alya.jpeg",
    quantity: 60,
    category: "Fast Food",
  },

  // Italian
  {
    name: "Margherita Pizza",
    description:
      "Classic pizza with fresh mozzarella, basil, and tomato sauce.",
    price: 12.5,
    image: "margherita_pizza.jpg",
    quantity: 30,
    category: "Italian",
  },
  {
    name: "Spaghetti Carbonara",
    description:
      "Creamy pasta with pancetta, eggs, parmesan cheese, and black pepper.",
    price: 14.99,
    image: "carbonara.jpg",
    quantity: 35,
    category: "Italian",
  },
  {
    name: "Chicken Parmesan",
    description:
      "Breaded chicken breast topped with marinara sauce and melted mozzarella.",
    price: 16.99,
    image: "chicken_parm.jpg",
    quantity: 20,
    category: "Italian",
  },
  {
    name: "Lasagna",
    description:
      "Layers of pasta with meat sauce, ricotta, and mozzarella cheese.",
    price: 15.5,
    image: "lasagna.jpg",
    quantity: 15,
    category: "Italian",
  },
  {
    name: "Caesar Salad",
    description:
      "Crisp romaine lettuce with parmesan cheese, croutons, and Caesar dressing.",
    price: 8.99,
    image: "caesar_salad.jpg",
    quantity: 45,
    category: "Italian",
  },

  // Desserts
  //   {
  //     name: "Chocolate Cake",
  //     description: "Rich and moist chocolate cake with a creamy ganache topping.",
  //     price: 6.0,
  //     image: "nami.jpeg",
  //     quantity: 20,
  //     category: "Dessert",
  //   },
  //   {
  //     name: "Cheesecake",
  //     description: "New York style cheesecake with fresh strawberry topping.",
  //     price: 7.5,
  //     image: "cheesecake.jpg",
  //     quantity: 25,
  //     category: "Dessert",
  //   },
  //   {
  //     name: "Tiramisu",
  //     description:
  //       "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
  //     price: 8.99,
  //     image: "tiramisu.jpg",
  //     quantity: 18,
  //     category: "Dessert",
  //   },
  //   {
  //     name: "Ice Cream Sundae",
  //     description:
  //       "Vanilla ice cream with chocolate sauce, whipped cream, and cherry.",
  //     price: 5.5,
  //     image: "ice_cream_sundae.jpg",
  //     quantity: 40,
  //     category: "Dessert",
  //   },
  //   {
  //     name: "Apple Pie",
  //     description: "Homemade apple pie with cinnamon and a flaky pastry crust.",
  //     price: 6.99,
  //     image: "apple_pie.jpg",
  //     quantity: 12,
  //     category: "Dessert",
  //   },

  //   // Nepali
  //   {
  //     name: "Chicken Biryani",
  //     description:
  //       "Aromatic basmati rice cooked with tender chicken and Indian spices.",
  //     price: 10.0,
  //     image: "nico.jpg",
  //     quantity: 40,
  //     category: "Nepali",
  //   },
  //   {
  //     name: "Dal Bhat",
  //     description:
  //       "Traditional Nepali meal with lentil soup, rice, and vegetable curry.",
  //     price: 9.99,
  //     image: "dal_bhat.jpg",
  //     quantity: 35,
  //     category: "Nepali",
  //   },
  //   {
  //     name: "Chicken Momo",
  //     description:
  //       "Steamed dumplings filled with seasoned ground chicken and herbs.",
  //     price: 8.5,
  //     image: "chicken_momo.jpg",
  //     quantity: 50,
  //     category: "Nepali",
  //   },
  //   {
  //     name: "Vegetable Curry",
  //     description: "Mixed vegetables cooked in a spicy tomato-based curry sauce.",
  //     price: 7.99,
  //     image: "veg_curry.jpg",
  //     quantity: 30,
  //     category: "Nepali",
  //   },
  //   {
  //     name: "Chicken Sekuwa",
  //     description:
  //       "Grilled chicken marinated in Nepali spices and served with rice.",
  //     price: 12.99,
  //     image: "chicken_sekuwa.jpg",
  //     quantity: 25,
  //     category: "Nepali",
  //   },

  //   // Mexican
  //   {
  //     name: "Chicken Tacos",
  //     description:
  //       "Soft tortillas filled with seasoned chicken, salsa, and fresh cilantro.",
  //     price: 9.99,
  //     image: "chicken_tacos.jpg",
  //     quantity: 45,
  //     category: "Mexican",
  //   },
  //   {
  //     name: "Beef Burrito",
  //     description:
  //       "Large flour tortilla wrapped with seasoned beef, rice, beans, and cheese.",
  //     price: 11.5,
  //     image: "beef_burrito.jpg",
  //     quantity: 35,
  //     category: "Mexican",
  //   },
  //   {
  //     name: "Guacamole & Chips",
  //     description: "Fresh avocado dip served with crispy tortilla chips.",
  //     price: 6.99,
  //     image: "guacamole.jpg",
  //     quantity: 60,
  //     category: "Mexican",
  //   },
  //   {
  //     name: "Quesadilla",
  //     description:
  //       "Grilled tortilla filled with melted cheese and served with sour cream.",
  //     price: 8.99,
  //     image: "quesadilla.jpg",
  //     quantity: 40,
  //     category: "Mexican",
  //   },
  //   {
  //     name: "Nachos Supreme",
  //     description:
  //       "Tortilla chips topped with cheese, jalapeños, sour cream, and ground beef.",
  //     price: 10.99,
  //     image: "nachos.jpg",
  //     quantity: 30,
  //     category: "Mexican",
  //   },

  //   // Chinese
  //   {
  //     name: "Sweet & Sour Chicken",
  //     description:
  //       "Battered chicken pieces in a tangy sweet and sour sauce with pineapple.",
  //     price: 13.99,
  //     image: "sweet_sour_chicken.jpg",
  //     quantity: 30,
  //     category: "Chinese",
  //   },
  //   {
  //     name: "Fried Rice",
  //     description: "Wok-fried rice with eggs, vegetables, and soy sauce.",
  //     price: 8.5,
  //     image: "fried_rice.jpg",
  //     quantity: 50,
  //     category: "Chinese",
  //   },
  //   {
  //     name: "Beef Lo Mein",
  //     description:
  //       "Soft noodles stir-fried with beef and vegetables in savory sauce.",
  //     price: 12.99,
  //     image: "lo_mein.jpg",
  //     quantity: 25,
  //     category: "Chinese",
  //   },
  //   {
  //     name: "Spring Rolls",
  //     description:
  //       "Crispy fried rolls filled with vegetables and served with sweet sauce.",
  //     price: 6.99,
  //     image: "spring_rolls.jpg",
  //     quantity: 40,
  //     category: "Chinese",
  //   },
  //   {
  //     name: "Kung Pao Chicken",
  //     description:
  //       "Spicy stir-fried chicken with peanuts and dried chili peppers.",
  //     price: 14.5,
  //     image: "kung_pao.jpg",
  //     quantity: 20,
  //     category: "Chinese",
  //   },

  //   // American
  //   {
  //     name: "BBQ Ribs",
  //     description: "Tender pork ribs glazed with smoky barbecue sauce.",
  //     price: 18.99,
  //     image: "bbq_ribs.jpg",
  //     quantity: 15,
  //     category: "American",
  //   },
  //   {
  //     name: "Mac & Cheese",
  //     description: "Creamy macaroni pasta with melted cheddar cheese.",
  //     price: 7.99,
  //     image: "mac_cheese.jpg",
  //     quantity: 35,
  //     category: "American",
  //   },
  //   {
  //     name: "Chicken & Waffles",
  //     description:
  //       "Crispy fried chicken served with Belgian waffles and maple syrup.",
  //     price: 15.99,
  //     image: "chicken_waffles.jpg",
  //     quantity: 20,
  //     category: "American",
  //   },
  //   {
  //     name: "Clam Chowder",
  //     description: "Creamy New England style soup with clams and potatoes.",
  //     price: 9.5,
  //     image: "clam_chowder.jpg",
  //     quantity: 25,
  //     category: "American",
  //   },

  //   // Japanese
  //   {
  //     name: "California Roll",
  //     description: "Sushi roll with imitation crab, avocado, and cucumber.",
  //     price: 8.99,
  //     image: "california_roll.jpg",
  //     quantity: 40,
  //     category: "Japanese",
  //   },
  //   {
  //     name: "Chicken Teriyaki",
  //     description:
  //       "Grilled chicken glazed with sweet teriyaki sauce and served with rice.",
  //     price: 13.5,
  //     image: "chicken_teriyaki.jpg",
  //     quantity: 30,
  //     category: "Japanese",
  //   },
  //   {
  //     name: "Miso Soup",
  //     description:
  //       "Traditional Japanese soup with miso paste, tofu, and seaweed.",
  //     price: 4.99,
  //     image: "miso_soup.jpg",
  //     quantity: 60,
  //     category: "Japanese",
  //   },
  //   {
  //     name: "Chicken Ramen",
  //     description:
  //       "Rich chicken broth with ramen noodles, egg, and green onions.",
  //     price: 11.99,
  //     image: "chicken_ramen.jpg",
  //     quantity: 25,
  //     category: "Japanese",
  //   },
  //   {
  //     name: "Tempura Vegetables",
  //     description:
  //       "Lightly battered and fried seasonal vegetables with dipping sauce.",
  //     price: 9.99,
  //     image: "tempura_veg.jpg",
  //     quantity: 35,
  //     category: "Japanese",
  //   },

  //   // Indian
  //   {
  //     name: "Butter Chicken",
  //     description: "Tender chicken in a creamy tomato-based curry sauce.",
  //     price: 14.99,
  //     image: "butter_chicken.jpg",
  //     quantity: 30,
  //     category: "Indian",
  //   },
  //   {
  //     name: "Naan Bread",
  //     description: "Soft and fluffy Indian flatbread baked in a tandoor oven.",
  //     price: 3.99,
  //     image: "naan.jpg",
  //     quantity: 80,
  //     category: "Indian",
  //   },
  //   {
  //     name: "Samosas",
  //     description: "Crispy pastries filled with spiced potatoes and peas.",
  //     price: 6.5,
  //     image: "samosas.jpg",
  //     quantity: 45,
  //     category: "Indian",
  //   },
  //   {
  //     name: "Lamb Vindaloo",
  //     description: "Spicy lamb curry with potatoes in a tangy sauce.",
  //     price: 16.99,
  //     image: "lamb_vindaloo.jpg",
  //     quantity: 20,
  //     category: "Indian",
  //   },

  //   // Thai
  //   {
  //     name: "Pad Thai",
  //     description: "Stir-fried rice noodles with shrimp, tofu, and peanuts.",
  //     price: 12.99,
  //     image: "pad_thai.jpg",
  //     quantity: 35,
  //     category: "Thai",
  //   },
  //   {
  //     name: "Green Curry",
  //     description:
  //       "Spicy coconut curry with chicken, Thai basil, and vegetables.",
  //     price: 13.99,
  //     image: "green_curry.jpg",
  //     quantity: 25,
  //     category: "Thai",
  //   },
  //   {
  //     name: "Tom Yum Soup",
  //     description: "Hot and sour soup with shrimp, mushrooms, and lemongrass.",
  //     price: 8.99,
  //     image: "tom_yum.jpg",
  //     quantity: 40,
  //     category: "Thai",
  //   },
  //   {
  //     name: "Mango Sticky Rice",
  //     description: "Sweet coconut sticky rice served with fresh mango slices.",
  //     price: 7.5,
  //     image: "mango_rice.jpg",
  //     quantity: 30,
  //     category: "Thai",
  //   },
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
    console.log(`📊 Total items inserted: ${preparedFoods.length}`);
    console.log(
      `📁 Categories: ${[
        ...new Set(sampleFoods.map((food) => food.category)),
      ].join(", ")}`
    );
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error inserting sample data:", err);
    mongoose.disconnect();
  });
