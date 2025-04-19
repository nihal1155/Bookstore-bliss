const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    validate: {
      validator: function(v) {
        return v.length >= 3; // Only allows alphanumeric characters and spaces
      },
      message: props => `${props.value} is not a valid title!`
    }
  },
  slug: { 
    type: String,
    unique: true
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
    min: 0
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
    enum: ['Fiction', 'Mystery', 'Thriller', 'Science Fiction', 'Romance', 'Fantasy', 'Other']
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
}, {
  timestamps: true,
  strict: true // Only allows fields defined in the schema
});

productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = productSchema;