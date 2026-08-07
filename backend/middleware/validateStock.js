const validateStock = (req, res, next) => {
    const {
        product_id,
        quantity
    } = req.body;

    if (!product_id) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }

    if (
        quantity === undefined ||
        Number(quantity) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be greater than zero"
        });
    }

    next();
};

module.exports = validateStock;