const Product = require('./models/product');
const Order = require('./models/order');

exports.addProductToOrder = async (req, res) => {
    const { OrderId, ProductId } = req.body;

    try {
        const order = await Order.findByPk(OrderId);
        const product = await Product.findByPk(ProductId);

        if (!order || !product) {
            return res.status(404).json({
                success: false,
                message: "Order or Product not found."
            });
        }

        await order.addProduct(product);

        return res.status(200).json({
            success: true,
            message: "Product added to order successfully."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error adding product to order.",
            error: error.message
        });
    }
};
