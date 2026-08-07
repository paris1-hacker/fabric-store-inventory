const validateProduct = (req, res, next) => {
    const {
        name,
        category_id,
        supplier_id,
        price_per_yard
    } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Product name is required"
        });
    }

    if (!category_id) {
        return res.status(400).json({
            success: false,
            message: "Category is required"
        });
    }

    if (!supplier_id) {
        return res.status(400).json({
            success: false,
            message: "Supplier is required"
        });
    }

    if (
        price_per_yard === undefined ||
        Number(price_per_yard) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Price must be greater than zero"
        });
    }

    next();
};

module.exports = validateProduct;