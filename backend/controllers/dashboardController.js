const dashboardModel = require("../models/dashboardModel");

const getSummary = async (req, res, next) => {
    try {
        const summary = await dashboardModel.getSummary();

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

const getLowStockProducts = async (req, res, next) => {
    try {
        const products =
            await dashboardModel.getLowStockProducts();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

const getRecentMovements = async (req, res, next) => {
    try {
        const movements =
            await dashboardModel.getRecentMovements();

        res.status(200).json({
            success: true,
            count: movements.length,
            data: movements
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary,
    getLowStockProducts,
    getRecentMovements
};