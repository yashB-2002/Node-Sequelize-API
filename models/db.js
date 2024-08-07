const { DataTypes } = require('sequelize');
const sequelize = require('../postgresql/config'); 
const Post = require('./post');
const User = require('./user');



User.hasMany(Post,{
    foreignKey:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
})

Post.belongsTo(User,{
    foreignKey: 'UserId',
})


sequelize.sync().then(()=>{
    console.log('models synced successfully');
})
.catch((err)=>{
    console.log(`error occured while syncing models to postgresql ${err.message}`);
    
})
