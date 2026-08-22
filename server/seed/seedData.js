const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const Food = require("../models/Food");
const foodData = require("./foodData");

dotenv.config();

// Connect to Database
connectDB();

const importData = async () => {
  try {
    // Delete existing food items
    await Food.deleteMany();

    // Insert new food items
    await Food.insertMany(foodData);

    console.log("Food Data Imported Successfully");

    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

importData();