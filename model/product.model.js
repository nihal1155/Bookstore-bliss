const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends of a string
    maxlength: 200 // Limits the length of the title
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0 // Ensures the price cannot be negative
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Fiction', 'Mystery', 'Thriller', 'Science Fiction', 'Fantasy', 'Other'] // Limits the category to specific values
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0 // Sets a default value if not provided
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = productSchema;