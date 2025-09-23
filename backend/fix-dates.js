import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function fixDates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const result = await mongoose.connection.db.collection("foods").updateMany(
      { createdAt: { $exists: false } },
      {
        $set: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log(`Matched ${result.matchedCount} documents`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixDates();
