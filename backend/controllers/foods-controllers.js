import Food from "../models/FoodModel.js";
import HttpError from "../models/HttpError.js";

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

    let query = {};

    if (category && category !== "all") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

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

    if (page && limit) {
      const pageNumber = parseInt(page);
      const pageSize = Math.min(parseInt(limit), 100);
      const skip = (pageNumber - 1) * pageSize;

      const foods = await Food.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(pageSize)
        .lean();

      const totalItems = await Food.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);

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

    const foods = await Food.find(query).sort(sortObj).lean();
    res.json(foods);
  } catch (err) {
    console.error("Error fetching foods:", err);
    return next(new HttpError("Failed to fetch foods", 500));
  }
}

export const getFoodById = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    if (!foodId) {
      return next(new HttpError("Food ID is required", 400));
    }

    const food = await Food.findById(foodId).lean();

    if (!food) {
      return next(new HttpError("Food item not found", 404));
    }

    res.status(200).json({
      success: true,
      food,
      message: "Food details retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching food details:", err);

    if (err.name === "CastError") {
      return next(new HttpError("Invalid food ID format", 400));
    }

    return next(new HttpError("Failed to fetch food details", 500));
  }
};

export const getRelatedFoods = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { limit = 4 } = req.query;

    const currentFood = await Food.findById(foodId);

    if (!currentFood) {
      return next(new HttpError("Food item not found", 404));
    }

    const relatedFoods = await Food.find({
      category: { $regex: `^${currentFood.category}$`, $options: "i" },
      _id: { $ne: foodId },
    })
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      relatedFoods,
      totalRelated: relatedFoods.length,
      message: "Related foods retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching related foods:", err);

    if (err.name === "CastError") {
      return next(new HttpError("Invalid food ID format", 400));
    }

    return next(new HttpError("Failed to fetch related foods", 500));
  }
};

export async function getFoodByCategory(req, res, next) {
  try {
    const { category } = req.params;

    if (!category) {
      return next(new HttpError("Category is required", 400));
    }

    const {
      search,
      minPrice,
      maxPrice,
      sortBy = "name",
      order = "asc",
      page,
      limit,
    } = req.query;

    let query = {
      category: { $regex: `^${category}$`, $options: "i" },
    };

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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

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

export const createFood = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price || !quantity || !category) {
      return next(new HttpError("All fields are required", 422));
    }

    if (isNaN(price) || price <= 0) {
      return next(new HttpError("Price must be a positive number", 422));
    }

    if (isNaN(quantity) || quantity < 0) {
      return next(new HttpError("Quantity must be a non-negative number", 422));
    }

    if (!req.file) {
      return next(new HttpError("Please upload a food image", 422));
    }

    const image = req.file.path;

    const existingFood = await Food.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingFood) {
      return next(
        new HttpError("A food item with this name already exists", 422)
      );
    }

    const newFood = new Food({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: category.toLowerCase().trim(),
      image,
      // Remove manual createdAt and updatedAt - timestamps: true handles this
    });

    const savedFood = await newFood.save();

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      food: {
        id: savedFood._id,
        name: savedFood.name,
        description: savedFood.description,
        price: savedFood.price,
        quantity: savedFood.quantity,
        category: savedFood.category,
        image: savedFood.image,
        createdAt: savedFood.createdAt,
        updatedAt: savedFood.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating food:", error);

    if (error.code === 11000) {
      return next(
        new HttpError("A food item with this name already exists", 422)
      );
    }

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(
        new HttpError(`Validation error: ${errorMessages.join(", ")}`, 422)
      );
    }

    return next(new HttpError("Creating food failed, please try again", 500));
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { name, description, price, quantity, category } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return next(new HttpError("Food item not found", 404));
    }

    if (name) food.name = name.trim();
    if (description) food.description = description.trim();
    if (price) {
      if (isNaN(price) || price <= 0) {
        return next(new HttpError("Price must be a positive number", 422));
      }
      food.price = parseFloat(price);
    }
    if (quantity !== undefined) {
      if (isNaN(quantity) || quantity < 0) {
        return next(
          new HttpError("Quantity must be a non-negative number", 422)
        );
      }
      food.quantity = parseInt(quantity);
    }
    if (category) food.category = category.toLowerCase().trim();

    if (req.file) {
      food.image = req.file.path;
    }

    // Remove manual updatedAt - timestamps: true handles this automatically
    const updatedFood = await food.save();

    res.json({
      success: true,
      message: "Food item updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Error updating food:", error);
    return next(new HttpError("Updating food failed, please try again", 500));
  }
};

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
