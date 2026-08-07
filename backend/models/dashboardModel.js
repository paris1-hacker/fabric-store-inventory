const pool = require("../config/db");

const getSummary = async () => {
    const [rows] = await pool.query(`
        SELECT
            COUNT(DISTINCT p.id) AS total_products,
            COALESCE(SUM(i.quantity), 0) AS total_stock,
            COUNT(
                CASE
                    WHEN i.quantity > 0 AND i.quantity <= 10
                    THEN 1
                END
            ) AS low_stock_products,
            COUNT(
                CASE
                    WHEN i.quantity = 0
                    THEN 1
                END
            ) AS out_of_stock_products
        FROM products p
        LEFT JOIN inventory i
            ON p.id = i.product_id
    `);

    return rows[0];
};

const getLowStockProducts = async () => {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.name,
            c.name AS category_name,
            COALESCE(i.quantity, 0) AS quantity,
            p.price_per_yard
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.id
        LEFT JOIN inventory i
            ON p.id = i.product_id
        WHERE COALESCE(i.quantity, 0) <= 10
        ORDER BY quantity ASC
    `);

    return rows;
};

const getRecentMovements = async () => {
    const [rows] = await pool.query(`
        SELECT
            sm.id,
            p.name AS product_name,
            u.name AS user_name,
            sm.movement_type,
            sm.quantity,
            sm.previous_quantity,
            sm.new_quantity,
            sm.reference,
            sm.created_at
        FROM stock_movements sm
        INNER JOIN products p
            ON sm.product_id = p.id
        INNER JOIN users u
            ON sm.user_id = u.id
        ORDER BY sm.created_at DESC
        LIMIT 10
    `);

    return rows;
};

module.exports = {
    getSummary,
    getLowStockProducts,
    getRecentMovements
};