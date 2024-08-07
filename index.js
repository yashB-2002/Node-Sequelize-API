// index.js
require('dotenv').config()
const express = require('express');
const app = express();
// require("./models/db")
require("./models/db2")
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require("./routes/postRoutes")
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require('./routes/orderRoutes')
const authMiddleware = require('./middlewares/auth');
const { addProductToOrder } = require('./productOrderController');
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use('/Images', express.static('./Images'))

//? authentication routes
app.use('/api/auth', authRoutes);

app.use('/api/posts',authMiddleware,postRoutes)

//? CRUD routes
app.use('/api/users', authMiddleware,userRoutes);

//? M:N routes
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)

// app.post('/add-product-to-order', addProductToOrder);

//? home api
app.get('/',(req,res)=>{
    res.json({message:"hello"})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
