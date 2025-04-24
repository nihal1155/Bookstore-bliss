const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductBySlug, fetchProductsByPrice, updateProduct, deleteProduct } = require('../controllers/products.controller');

router.get('/products', getAllProducts);

router.post('/products', createProduct);

router.get('/products/price', fetchProductsByPrice);
  
router.get('/products/:slug', getProductBySlug);
  
router.put('/products/:slug', updateProduct);

router.delete('/products/:slug', deleteProduct);

module.exports = router;


