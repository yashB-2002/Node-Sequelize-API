const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config'); 
const Product = require('../models/product');
const Order = require('../models/order');
const ProductOrder = require('../models/productOrder');


sequelize.sync() 
    .then(() => {
        console.log('Models synced successfully');
    })
    .catch((err) => {
        console.error(`Error occurred while syncing models to PostgreSQL: ${err.message}`);
    });



