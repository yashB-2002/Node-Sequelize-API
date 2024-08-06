// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config'); 

const Post = sequelize.define('Post', {
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    caption: DataTypes.STRING,
    image: DataTypes.STRING,
    
  }, {});

  

module.exports = Post;
