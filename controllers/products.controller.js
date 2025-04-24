const mongoose = require('mongoose');
const productSchema = require('../model/product.model');
const Product = mongoose.model('Product', productSchema);

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
}

exports.getAllProducts = async(req, res) => {
    try {
      const products = await Product.find(); // Fetch all documents
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.fetchProductsByPrice = async (req, res) => {
  try {
    const { min, max } = req.query;
    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ message: 'minPrice and maxPrice query parameters are required' });
    }
    const products = await Product.find({
      price: { $gte: min, $lte: max }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by price:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.slug;
    console.log('Product ID:', productId);
    console.log(mongoose.Types.ObjectId.isValid(req.params.slug));
    const updates  = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
    console.log('Updated Product:', updatedProduct);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  }
  catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  }
  catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
