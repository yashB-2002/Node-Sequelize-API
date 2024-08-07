const Order = require("./models/order");
const Product = require("./models/product");
const sequelize = require("./postgresql/config");

function validateProduct(product) {

    const nameRegex = /^[A-Za-z0-9\s_-]*$/
    if(typeof product.product_name !== 'string' || typeof product.product_price !== 'number'
        || !nameRegex.test(product.product_name)
    ) {
        return false;
    }
    return true
}

exports.createProduct = async(req,res) => {
    
    const {product_name,product_price} = req.body

    if(!validateProduct(req.body)) {
        return res.status(400).json({
            success:false,
            message:"Invalid fields value."
        })
    }

    if(!product_name || !product_price) {
        return res.status(400).json({
            success:false,
            message:"Fields are missing.."
        })
    }

    const product = await Product.create(req.body)

    return res.status(201).json({
        success:true,
        message:"Product created successfully.",
        data:product
    })
    
}


exports.getAllProductsWithOrder = async(req,res)=>{

    const products = await Product.findAll({
        include: {
            model: Order,
            as: "Orders",
            through: { attributes: ['quantity'] }, 
            required:true
        }
    });

    return res.status(200).json({
        success: true,
        totalCount: products.length,
        data: products
    });

}

exports.getProductById = async(req,res) => {

    const product = await Product.findByPk(req.params.prodId,{
        include:{
            model:Order,
            as:"Orders",
            through: { attributes: ['quantity'] } 
        }
    })

    if(!product) {
        return res.status(404).json({
            success:false,
            message:"No product found"
        })
    }

    return res.status(200).json({
        success:true,
        message:"Product fetched success.",
        data:product
    })

}