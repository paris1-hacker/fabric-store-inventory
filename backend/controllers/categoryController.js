const categoryModel = require("../models/categoryModel");

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.getAllCategories();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const categoryId = await categoryModel.createCategory(
            name.trim(),
            description || null
        );

        const newCategory = await categoryModel.getCategoryById(categoryId);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory =
            await categoryModel.getCategoryById(id);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await categoryModel.updateCategory(
            id,
            name.trim(),
            description || null
        );

        const updatedCategory =
            await categoryModel.getCategoryById(id);

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingCategory =
            await categoryModel.getCategoryById(id);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await categoryModel.deleteCategory(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};