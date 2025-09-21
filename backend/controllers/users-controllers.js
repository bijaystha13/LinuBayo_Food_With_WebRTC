import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import HttpError from "../models/HttpError.js";
import User from "../models/UsersModels.js";
// Import your Order and FavoriteItem models (you'll need to create these)
// import Order from "../models/Order.js";
// import FavoriteItem from "../models/FavoriteItem.js";

// Helper Functions
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return new Date(date).toLocaleDateString();
};

const calculateGrowth = (current, previous) => {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

const formatJoinDate = (date) => {
  const options = { year: "numeric", month: "long" };
  return new Date(date).toLocaleDateString("en-US", options);
};

// Helper function to get food image path based on category
const getFoodImagePath = (foodName, category) => {
  const baseUrl = "http://localhost:5001";

  // Map food names to their actual image files
  const foodImageMap = {
    // Italian
    "Margherita Pizza": "/uploads/images/italian/margherita_pizza.jpg",
    Lasagna: "/uploads/images/italian/lasagna.jpg",
    Carbonara: "/uploads/images/italian/carbonara.jpg",

    // Fast Food
    "Chicken Burger": "/uploads/images/fast-food/cheeseburger.jpg",
    Cheeseburger: "/uploads/images/fast-food/cheeseburger.jpg",
    "French Fries": "/uploads/images/fast-food/fish_chips.jpg",
    "Chicken Wings": "/uploads/images/fast-food/chicken_wings.jpg",
    "Hot Dog": "/uploads/images/fast-food/hotdog.jpg",

    // Main Courses
    "Grilled Chicken": "/uploads/images/main/chicken_parm.jpg",
    "Chicken Parmesan": "/uploads/images/main/chicken_parm.jpg",
    "Fish and Chips": "/uploads/images/main/fish_chips.jpg",

    // Salads
    "Caesar Salad": "/uploads/images/salad/caesar_salad.jpg",
    "Chicken Caesar Salad": "/uploads/images/salad/caesar_salad.jpg",

    // Desserts
    "Chocolate Cake": "/uploads/images/dessert/alya.jpeg",
    Tiramisu: "/uploads/images/dessert/alya.jpeg",

    // Beverages
    "Coca Cola":
      "/uploads/images/beverage/8e0bd33a-c7ad-475f-96c5-940b16c5c6e5.jpg",
    "Orange Juice":
      "/uploads/images/beverage/53c39432-c5d3-421b-a854-90dc6e5b1234.jpg",
  };

  // Try to find exact match first
  if (foodImageMap[foodName]) {
    return baseUrl + foodImageMap[foodName];
  }

  // Fallback based on category
  const categoryImageMap = {
    italian: "/uploads/images/italian/margherita_pizza.jpg",
    "fast food": "/uploads/images/fast-food/cheeseburger.jpg",
    main: "/uploads/images/main/chicken_parm.jpg",
    salad: "/uploads/images/salad/caesar_salad.jpg",
    dessert: "/uploads/images/dessert/alya.jpeg",
    beverage:
      "/uploads/images/beverage/8e0bd33a-c7ad-475f-96c5-940b16c5c6e5.jpg",
    pizza: "/uploads/images/italian/margherita_pizza.jpg",
    appetizer: "/uploads/images/salad/caesar_salad.jpg",
    soup: "/uploads/images/main/chicken_parm.jpg",
  };

  const categoryImage = categoryImageMap[category?.toLowerCase()];
  return categoryImage
    ? baseUrl + categoryImage
    : baseUrl + "/uploads/images/italian/margherita_pizza.jpg";
};

export async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return next(new HttpError("Invalid inputs passed", 422));
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phonenumber, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exits, please login instead",
      422
    );
    return next(error);
  }

  const role = email === "admin@admin.com" ? "admin" : "user";
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again later.",
      500
    );
    return next(error);
  }

  const createdUser = await User({
    name,
    email,
    phonenumber,
    role,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    phonenumber: createdUser.phonenumber,
    role,
    token,
    message: "User Created",
  });
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Invalid credentials, could not log you in please check your credentials and try againa.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET || "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    message: "Logged In",
    userId: existingUser.id,
    email: existingUser.email,
    token,
    role: existingUser.role,
  });
}

export async function getUserDashboard(req, res, next) {
  try {
    // Debug logging
    console.log("Dashboard request received");
    console.log("User data from middleware:", req.userData);

    const userId = req.userData?.userId;

    if (!userId) {
      console.log("No userId found in request");
      return next(new HttpError("User ID not found in request.", 400));
    }

    // Get user basic info
    console.log("Fetching user with ID:", userId);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log("User not found in database:", userId);
      return next(new HttpError("User not found.", 404));
    }

    console.log("User found:", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    // Enhanced mock data with proper food images and categories
    const mockOrdersData = [
      {
        _id: "order1",
        orderNumber: "ORD-001234",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T12:30:00Z"),
        status: "delivered",
        total: 28.5,
        items: [
          {
            name: "Margherita Pizza",
            category: "italian",
            price: 16.99,
            quantity: 1,
          },
          {
            name: "Caesar Salad",
            category: "salad",
            price: 8.5,
            quantity: 1,
          },
          {
            name: "Coca Cola",
            category: "beverage",
            price: 3.0,
            quantity: 1,
          },
        ],
      },
      {
        _id: "order2",
        orderNumber: "ORD-001235",
        createdAt: new Date("2024-01-10T14:20:00Z"),
        updatedAt: new Date("2024-01-10T15:20:00Z"),
        status: "cancelled",
        total: 18.75,
        items: [
          {
            name: "Chicken Burger",
            category: "fast food",
            price: 12.99,
            quantity: 1,
          },
          {
            name: "French Fries",
            category: "fast food",
            price: 5.75,
            quantity: 1,
          },
        ],
      },
    ];

    const mockFavoritesData = [
      {
        _id: "fav1",
        itemId: {
          _id: "item1",
          name: "Margherita Pizza",
          category: "italian",
          price: 16.99,
          rating: 4.8,
        },
        orderCount: 5,
      },
      {
        _id: "fav2",
        itemId: {
          _id: "item2",
          name: "Chicken Caesar Salad",
          category: "salad",
          price: 12.5,
          rating: 4.6,
        },
        orderCount: 3,
      },
    ];

    // Mock calculations - replace with actual queries
    const orders = mockOrdersData;
    const favorites = mockFavoritesData;
    const totalOrders = mockOrdersData.length;
    const completedOrders = mockOrdersData.filter((order) =>
      ["delivered", "completed"].includes(order.status)
    );

    const totalSpent = completedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const favoriteItemsCount = favorites.length;

    // Calculate reward points (example: 10 points per dollar spent)
    const rewardPoints = Math.floor(totalSpent * 10);

    // Format recent orders with proper images
    const recentOrders = orders.map((order) => {
      // Get the main item (first item) for the order image
      const mainItem = order.items[0];
      const orderImage = getFoodImagePath(mainItem.name, mainItem.category);

      return {
        id: order._id,
        orderNumber:
          order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
        date: order.createdAt,
        status: order.status,
        items: order.items.map((item) => `${item.name} (x${item.quantity})`),
        itemsDetail: order.items,
        total: order.total,
        image: orderImage,
        mainItem: mainItem.name,
        itemCount: order.items.length,
      };
    });

    // Format favorite items with proper images
    const favoriteItemsData = favorites.map((fav) => ({
      id: fav.itemId?._id,
      name: fav.itemId?.name,
      category: fav.itemId?.category,
      price: fav.itemId?.price,
      rating: fav.itemId?.rating || 4.5,
      image: getFoodImagePath(fav.itemId?.name, fav.itemId?.category),
      orderCount: fav.orderCount || 0,
    }));

    // Create notifications with order-specific messages
    const notifications = [
      ...orders.slice(0, 2).map((order) => ({
        id: order._id,
        type: "order",
        message: `Your order #${
          order.orderNumber || order._id.toString().slice(-6)
        } with ${order.items[0].name}${
          order.items.length > 1
            ? ` and ${order.items.length - 1} more items`
            : ""
        } is ${order.status}`,
        time: getTimeAgo(order.updatedAt),
        unread: order.status !== "delivered" && order.status !== "cancelled",
      })),
      {
        id: "promo-1",
        type: "promotion",
        message: "New 20% discount on Italian cuisine available now!",
        time: "2 hours ago",
        unread: true,
      },
      {
        id: "reward-1",
        type: "reward",
        message: `You've earned ${Math.floor(
          totalSpent * 10
        )} reward points from your recent orders!`,
        time: "1 day ago",
        unread: false,
      },
    ];

    // Calculate growth percentages
    const stats = {
      totalOrders,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      favoriteItems: favoriteItemsCount,
      rewardPoints,
      growth: {
        orders: calculateGrowth(totalOrders, Math.max(1, totalOrders - 2)),
        spent: calculateGrowth(totalSpent, Math.max(100, totalSpent - 50)),
        favorites: 3,
        points: 250,
      },
    };

    const responseData = {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          joinDate: formatJoinDate(user.createdAt),
          profileImage: user.profileImage || "/api/placeholder/100/100",
        },
        stats,
        recentOrders,
        favoriteItems: favoriteItemsData,
        notifications,
      },
    };

    console.log("Sending response:", { success: true, userFound: true });
    console.log(
      "Recent orders with images:",
      recentOrders.map((order) => ({
        id: order.id,
        mainItem: order.mainItem,
        image: order.image,
        status: order.status,
      }))
    );

    res.json(responseData);
  } catch (err) {
    console.error("Dashboard API Error:", err);
    console.error("Error stack:", err.stack);
    return next(
      new HttpError(`Failed to fetch dashboard data: ${err.message}`, 500)
    );
  }
}

export async function getUserProfile(req, res, next) {
  const userId = req.userData.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phonenumber: user.phonenumber,
        role: user.role,
        joinDate: user.createdAt,
        profileImage: user.profileImage || "/api/placeholder/100/100",
      },
    });
  } catch (err) {
    return next(new HttpError("Failed to fetch user profile.", 500));
  }
}
