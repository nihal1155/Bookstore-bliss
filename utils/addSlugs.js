const mongoose = require('mongoose');
const slugify = require('slugify');
const productSchema = require('../model/product.model');
const Product = mongoose.model('Product', productSchema);
require('dotenv').config();
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function addSlugsToAllProducts() {
  // Find all products that do not have a slug field
  const products = await Product.find({ slug: { $exists: false } });

  for (let product of products) {
    // Generate slug based on title
    product.slug = slugify(product.title, { lower: true, strict: true });

    // Save the product with the new slug
    await product.save();
    console.log(`Added slug for: ${product.title}`);
  }

  console.log('All products have slugs added!');
  mongoose.disconnect();
}

addSlugsToAllProducts();
