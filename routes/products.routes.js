const express = require('express');
const router = express.Router();
const ProductSchema = require('../models/product.model');
const mongoose = require('mongoose');

router.get('/products', (req, res) => {
    const products = [
      { id: 1, name: 'The Lord of the Rings', price: 25.99 },
      { id: 2, name: 'Pride and Prejudice', price: 12.50 },
    ];
    res.json(products);
});

router.get('/products/price', (req, res) => {
    const minPrice = parseFloat(req.query.min);
    const maxPrice = parseFloat(req.query.max);
    const products = [
      { id: 1, name: 'The Lord of the Rings', price: 25.99 },
      { id: 2, name: 'Pride and Prejudice', price: 12.50 },
    ];
    const filteredProducts = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    console.log(filteredProducts);
    res.json(filteredProducts);
  }
);
  
router.get('/products/:id', (req, res) => {
    if(isNaN(req.params.id)) {
      return res.status(400).send('Invalid product ID');
    };
    const productId = parseInt(req.params.id);
    const product = { id: productId, name: 'The Lord of the Rings', price: 25.99 };
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found'); 
    }
});
  
router.post('/products', (req, res) => {
    const newProduct = req.body;
    if(newProduct.name === undefined || newProduct.price === undefined) {
      return res.status(400).send('Invalid product data');
    }
    if(isNaN(newProduct.price)) {
      return res.status(400).send('Invalid product price');
    }
    console.log('New product created:', newProduct);
    res.status(201).json(newProduct); 
});
  
router.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); 
    const updatedProduct = req.body; 

    console.log(`Product ${productId} updated:`, updatedProduct);
    res.json({ id: productId, ...updatedProduct }); 
});

router.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); 
    console.log(`Product ${productId} deleted`);
    res.status(204).send();
});

module.exports = router;


