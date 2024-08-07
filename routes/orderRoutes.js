const express = require('express');
const { createOrder, getAllOrders, getOrderById } = require('../orderController');
const router = express.Router();

router.route('')
.post(createOrder)
.get(getAllOrders)

router.route('/:orderId').get(getOrderById)
  module.exports = router;
