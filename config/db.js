const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

console.log('Mongo URI:', mongoURI);
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Optional but useful for fail-fast
  }
};

module.exports = connectDB;
