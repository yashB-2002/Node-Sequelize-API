const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config'); 

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    order_type:{
        type:DataTypes.STRING,
    },
    order_value:{
        type:DataTypes.FLOAT,
    }
  }, {});



module.exports = Order;
