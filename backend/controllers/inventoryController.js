const pool = require("../config/db");
const inventoryModel = require("../models/inventoryModel");

const getInventory = async (req, res, next) => {
    try {
        const {
            search,
            category_id,
            supplier_id,
            status
        } = req.query;

        const inventory = await inventoryModel.getAllInventory({
            search,
            category_id,
            supplier_id,
            status
        });

        res.status(200).json({
            success: true,
            count: inventory.length,
            data: inventory
        });
    } catch (error) {
        next(error);
    }
};




const getProductInventory = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const inventory =
            await inventoryModel.getInventoryByProductId(productId);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory record not found"
            });
        }

        res.status(200).json({
            success: true,
            data: inventory
        });
    } catch (error) {
        next(error);
    }
};


const stockIn = async (req, res, next) => {
    const connection = await pool.getConnection();

    try {
        const {
            product_id,
            quantity,
            reference
        } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product is required"
            });
        }

        if (!quantity || Number(quantity) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        const numericQuantity = Number(quantity);

        await connection.beginTransaction();

        const [products] = await connection.query(
            "SELECT id FROM products WHERE id = ?",
            [product_id]
        );

        if (products.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const [inventoryRows] = await connection.query(
            "SELECT * FROM inventory WHERE product_id = ? FOR UPDATE",
            [product_id]
        );

        let previousQuantity = 0;

        if (inventoryRows.length === 0) {
            await connection.query(`
                INSERT INTO inventory (
                    product_id,
                    quantity
                )
                VALUES (?, ?)
            `, [
                product_id,
                numericQuantity
            ]);
        } else {
            previousQuantity =
                Number(inventoryRows[0].quantity);

            const newQuantity =
                previousQuantity + numericQuantity;

            await connection.query(`
                UPDATE inventory
                SET quantity = ?
                WHERE product_id = ?
            `, [
                newQuantity,
                product_id
            ]);
        }

        const newQuantity =
            previousQuantity + numericQuantity;

        await connection.query(`
            INSERT INTO stock_movements (
                product_id,
                movement_type,
                quantity,
                previous_quantity,
                new_quantity,
                reference
            )
            VALUES (?, 'IN', ?, ?, ?, ?)
        `, [
            product_id,
            numericQuantity,
            previousQuantity,
            newQuantity,
            reference || null
        ]);

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Stock added successfully",
            data: {
                product_id,
                previous_quantity: previousQuantity,
                quantity_added: numericQuantity,
                new_quantity: newQuantity
            }
        });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};



const stockOut = async (req, res, next) => {
    const connection = await pool.getConnection();

    try {
        const {
            product_id,
            quantity,
            reference
        } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product is required"
            });
        }

        if (!quantity || Number(quantity) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        const numericQuantity = Number(quantity);

        await connection.beginTransaction();

        const [inventoryRows] = await connection.query(
            "SELECT * FROM inventory WHERE product_id = ? FOR UPDATE",
            [product_id]
        );

        if (inventoryRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "No inventory record exists for this product"
            });
        }

        const previousQuantity =
            Number(inventoryRows[0].quantity);

        if (numericQuantity > previousQuantity) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Insufficient stock",
                data: {
                    available: previousQuantity,
                    requested: numericQuantity
                }
            });
        }

        const newQuantity =
            previousQuantity - numericQuantity;

        await connection.query(`
            UPDATE inventory
            SET quantity = ?
            WHERE product_id = ?
        `, [
            newQuantity,
            product_id
        ]);

        await connection.query(`
            INSERT INTO stock_movements (
                product_id,
                movement_type,
                quantity,
                previous_quantity,
                new_quantity,
                reference
            )
            VALUES (?, 'OUT', ?, ?, ?, ?)
        `, [
            product_id,
            numericQuantity,
            previousQuantity,
            newQuantity,
            reference || null
        ]);

        await connection.commit();

        res.status(200).json({
            success: true,
            message: "Stock removed successfully",
            data: {
                product_id,
                previous_quantity: previousQuantity,
                quantity_removed: numericQuantity,
                new_quantity: newQuantity
            }
        });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};


const getMovements = async (req, res, next) => {
    try {
        const movements =
            await inventoryModel.getMovements();

        res.status(200).json({
            success: true,
            data: movements
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInventory,
    getProductInventory,
    stockIn,
    stockOut,
    getMovements
};