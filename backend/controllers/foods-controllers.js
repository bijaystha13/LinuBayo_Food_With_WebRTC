import Food from "../models/FoodModel.js";
import HttpError from "../models/HttpError.js";

// Get all foods with advanced filtering, sorting, and pagination
export async function getAllFoods(req, res, next) {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "name",
      order = "asc",
      page,
      limit,
    } = req.query;

    // Build query object
    let query = {};

    // Category filter
    if (category && category !== "all") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // Search filter (name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sortObj = {};
    switch (sortBy) {
      case "price":
        sortObj.price = order === "desc" ? -1 : 1;
        break;
      case "createdAt":
        sortObj.createdAt = order === "desc" ? -1 : 1;
        break;
      case "name":
      default:
        sortObj.name = order === "desc" ? -1 : 1;
        break;
    }

    // Check if pagination is requested
    if (page && limit) {
      // Calculate pagination
      const pageNumber = parseInt(page);
      const pageSize = Math.min(parseInt(limit), 100); // Max 100 items per page
      const skip = (pageNumber - 1) * pageSize;

      // Execute query with pagination
      const foods = await Food.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean(); // Use lean for better performance

      // Get total count for pagination info
      const totalItems = await Food.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);

      // Response with pagination info
      const response = {
        foods,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalItems,
          itemsPerPage: pageSize,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      };

      return res.json(response);
    }

    // Without pagination - return all foods
    const foods = await Food.find(query).sort(sortObj).lean();
    res.json(foods);
  } catch (err) {
    console.error("Error fetching foods:", err);
    return next(new HttpError("Failed to fetch foods", 500));
  }
}

// Get foods by specific category
export async function getFoodByCategory(req, res, next) {
  try {
    const { category } = req.params;

    if (!category) {
      return next(new HttpError("Category is required", 400));
    }

    // Additional query parameters for filtering within category
    const {
      search,
      minPrice,
      maxPrice,
      sortBy = "name",
      order = "asc",
      page,
      limit,
    } = req.query;

    // Build base query with category
    let query = {
      category: { $regex: `^${category}$`, $options: "i" },
    };

    // Search filter within category
    if (search) {
      query.$and = [
        { category: { $regex: `^${category}$`, $options: "i" } },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sortObj = {};
    switch (sortBy) {
      case "price":
        sortObj.price = order === "desc" ? -1 : 1;
        break;
      case "createdAt":
        sortObj.createdAt = order === "desc" ? -1 : 1;
        break;
      case "name":
      default:
        sortObj.name = order === "desc" ? -1 : 1;
        break;
    }

    // Check if pagination is requested
    if (page && limit) {
      const pageNumber = parseInt(page);
      const pageSize = Math.min(parseInt(limit), 100);
      const skip = (pageNumber - 1) * pageSize;

      const products = await Food.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean();

      const totalItems = await Food.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);

      const response = {
        success: true,
        products,
        category: category.toLowerCase(),
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalItems,
          itemsPerPage: pageSize,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      };

      return res.json(response);
    }

    // Without pagination
    const products = await Food.find(query).sort(sortObj).lean();

    if (!products || products.length === 0) {
      return res.json({
        success: true,
        message: `No products found in ${category} category`,
        category: category.toLowerCase(),
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      products,
      category: category.toLowerCase(),
      totalItems: products.length,
    });
  } catch (err) {
    console.error("Error fetching foods by category:", err);
    return next(new HttpError(`Failed to fetch ${category} products`, 500));
  }
}

// Create a new food item
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

// Delete a food item
export const deleteFood = async (req, res, next) => {
  const { foodId } = req.params;

  try {
    const food = await Food.findById(foodId);

    if (!food) {
      return next(new HttpError("Food item not found.", 404));
    }

    await Food.findByIdAndDelete(foodId);

    res.json({
      success: true,
      message: "Food item deleted successfully",
      deletedFoodId: foodId,
    });
  } catch (err) {
    console.error("Error deleting food:", err);
    return next(new HttpError("Failed to delete food item", 500));
  }
};
