const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config'); 

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    product_name:{
        type:DataTypes.STRING,
    },
    product_price:{
        type:DataTypes.INTEGER,
    }
  }, {});



module.exports = Product;
