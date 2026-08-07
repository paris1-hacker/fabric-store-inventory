const pool = require("../config/db");

const getAllInventory = async (filters = {}) => {
    let sql = `
        SELECT
            i.id,
            i.product_id,
            p.name AS product_name,
            p.price_per_yard,
            c.name AS category_name,
            s.name AS supplier_name,
            p.color,
            p.material,
            i.quantity,
            i.updated_at
        FROM inventory i
        INNER JOIN products p
            ON i.product_id = p.id
        INNER JOIN categories c
            ON p.category_id = c.id
        INNER JOIN suppliers s
            ON p.supplier_id = s.id
        WHERE 1 = 1
    `;

    const values = [];

    // Search
    if (filters.search) {
        sql += `
            AND (
                p.name LIKE ?
                OR p.material LIKE ?
                OR p.color LIKE ?
            )
        `;

        const searchValue = `%${filters.search}%`;

        values.push(
            searchValue,
            searchValue,
            searchValue
        );
    }

    // Category
    if (filters.category_id) {
        sql += ` AND p.category_id = ?`;
        values.push(filters.category_id);
    }

    // Supplier
    if (filters.supplier_id) {
        sql += ` AND p.supplier_id = ?`;
        values.push(filters.supplier_id);
    }

    // Stock status
    if (filters.status === "low") {
        sql += ` AND i.quantity > 0 AND i.quantity <= 10`;
    }

    if (filters.status === "out") {
        sql += ` AND i.quantity = 0`;
    }

    if (filters.status === "available") {
        sql += ` AND i.quantity > 10`;
    }

    // Count filtered records BEFORE pagination
    const countSql = `
        SELECT COUNT(*) AS total
        FROM (${sql}) AS filtered_inventory
    `;

    const [countRows] = await pool.query(
        countSql,
        values
    );

    const total = countRows[0].total;

    // Pagination
    const page = Math.max(
        parseInt(filters.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(
            parseInt(filters.limit) || 10,
            1
        ),
        100
    );

    const offset = (page - 1) * limit;

    sql += `
        ORDER BY p.name ASC
        LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(
        sql,
        [...values, limit, offset]
    );

    return {
        inventory: rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};



const getInventoryByProductId = async (productId) => {
    const [rows] = await pool.query(`
        SELECT
            i.id,
            i.product_id,
            p.name AS product_name,
            p.price_per_yard,
            i.quantity,
            i.updated_at
        FROM inventory i
        INNER JOIN products p
            ON i.product_id = p.id
        WHERE i.product_id = ?
    `, [productId]);

    return rows[0];
};

const createInventory = async (productId, quantity) => {
    const [result] = await pool.query(`
        INSERT INTO inventory (
            product_id,
            quantity
        )
        VALUES (?, ?)
    `, [
        productId,
        quantity
    ]);

    return result.insertId;
};

const updateInventoryQuantity = async (productId, quantity) => {
    const [result] = await pool.query(`
        UPDATE inventory
        SET quantity = ?
        WHERE product_id = ?
    `, [
        quantity,
        productId
    ]);

    return result;
};

const createMovement = async (
    productId,
    movementType,
    quantity,
    previousQuantity,
    newQuantity,
    reference
) => {
    const [result] = await pool.query(`
        INSERT INTO stock_movements (
            product_id,
            movement_type,
            quantity,
            previous_quantity,
            new_quantity,
            reference
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        productId,
        movementType,
        quantity,
        previousQuantity,
        newQuantity,
        reference
    ]);

    return result.insertId;
};

const getMovements = async () => {
    const [rows] = await pool.query(`
        SELECT
            sm.id,
            sm.product_id,
            p.name AS product_name,
            sm.user_id,
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
    `);

    return rows;
};



module.exports = {
    getAllInventory,
    getInventoryByProductId,
    createInventory,
    updateInventoryQuantity,
    createMovement,
    getMovements
};

