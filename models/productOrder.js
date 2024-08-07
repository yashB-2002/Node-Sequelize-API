// models/productOrder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config');
const Product = require('./product');
const Order = require('./order');

const ProductOrder = sequelize.define('ProductOrder', {
    quantity: {
        type: DataTypes.INTEGER,
    }
}, {});


Product.belongsToMany(Order, { through: ProductOrder });
Order.belongsToMany(Product, { through: ProductOrder });

module.exports = ProductOrder;
