const express = require('express');
const { createProduct, getAllProductsWithOrder, getProductById } = require('../productController');
const router = express.Router();

router.route('')
.post(createProduct)
.get(getAllProductsWithOrder)

router.route('/:prodId').get(getProductById)

  module.exports = router;
