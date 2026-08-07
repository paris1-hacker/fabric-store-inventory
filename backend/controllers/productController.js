const productModel = require("../models/productModel");

const getProducts = async (req, res, next) => {
    try {
        const {
            search,
            category_id,
            supplier_id,
            color,
            min_price,
            max_price,
            low_stock,
            out_of_stock
        } = req.query;

        const products = await productModel.getAllProducts({
            search,
            category_id,
            supplier_id,
            color,
            min_price,
            max_price,
            low_stock,
            out_of_stock
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await productModel.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            category_id,
            supplier_id,
            material,
            color,
            pattern,
            price_per_yard,
            description
        } = req.body;

        if (!name || name.trim() === "") {
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
                message: "Price per yard must be greater than zero"
            });
        }

        const productId = await productModel.createProduct(
            name.trim(),
            category_id,
            supplier_id,
            material || null,
            color || null,
            pattern || null,
            price_per_yard,
            description || null
        );

        const newProduct =
            await productModel.getProductById(productId);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            category_id,
            supplier_id,
            material,
            color,
            pattern,
            price_per_yard,
            description
        } = req.body;

        const existingProduct =
            await productModel.getProductById(id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        if (!category_id || !supplier_id) {
            return res.status(400).json({
                success: false,
                message: "Category and supplier are required"
            });
        }

        if (
            price_per_yard === undefined ||
            Number(price_per_yard) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Price per yard must be greater than zero"
            });
        }

        await productModel.updateProduct(
            id,
            name.trim(),
            category_id,
            supplier_id,
            material || null,
            color || null,
            pattern || null,
            price_per_yard,
            description || null
        );

        const updatedProduct =
            await productModel.getProductById(id);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingProduct =
            await productModel.getProductById(id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await productModel.deleteProduct(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};