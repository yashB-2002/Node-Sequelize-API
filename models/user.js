// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config'); 

const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password:{
      type: DataTypes.STRING,
    },
    phonenumber: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    address: DataTypes.JSONB,
    hobbies: DataTypes.ARRAY(DataTypes.STRING)
  }, {});



module.exports = User;
