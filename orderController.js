const Order = require("./models/order");
const Product = require("./models/product");
const ProductOrder = require("./models/productOrder");

function validateOrder(order) {

    const validOrderTypes = ['COD','CARD','UPI']
    if(typeof order.order_type !== 'string' || typeof order.order_value !== 'number'
        || !validOrderTypes.includes(order.order_type)
    ) {
        return false;
    }
    return true
}

exports.createOrder = async(req,res) => {
    
    const { order_type, order_value, products } = req.body;

    if (!validateOrder(req.body)) {
        return res.status(400).json({
            success: false,
            message: "Invalid fields value."
        });
    }

    const order = await Order.create({ order_type, order_value });


    for (const product of products) {
        const eachProduct = await Product.findByPk(product.product_id); 
        if (!eachProduct) {
            return res.status(404).json({
                success: false,
                message: `Product id ${product.product_id} not found.`
            });
        }
    
        await ProductOrder.create({
            OrderId: order.id,
            ProductId: product.product_id,
            quantity: product.quantity
        });
    }
    

    return res.status(201).json({
        success: true,
        message: "order created successfully.",
        data: order
    });
   
}


exports.getAllOrders = async (req,res) => {

    const orders = await Order.findAll({
        include:{
            model:Product,
            as:"Products",            
        }
    });
    
    return res.status(200).json({
        success:true,
        message:'orders fetched successfully',
        data:orders
    })

}

exports.getOrderById = async (req,res) => {

    const order = await Order.findByPk(req.params.orderId,{
        include:{
            model:Product,
            as:"Products"
        }
    })

    if(!order) {
        return res.status(404).json({
            success:false,
            message:"No order found"
        })
    }

    return res.status(200).json({
        success:true,
        message:"Order fetched success.",
        data:order
    })
}
