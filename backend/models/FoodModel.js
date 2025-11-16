import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    ratings: [ratingSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate average rating
foodSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10; // Round to 1 decimal
    this.totalRatings = this.ratings.length;
  }
};

// Pre-save middleware to calculate average rating
foodSchema.pre("save", function () {
  this.calculateAverageRating();
});

const Food = mongoose.model("Food", foodSchema);

export default Food;
