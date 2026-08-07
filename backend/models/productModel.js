const pool = require("../config/db");


const getAllProducts = async (filters = {}) => {
    let sql = `
        SELECT
            p.id,
            p.name,
            p.category_id,
            c.name AS category_name,
            p.supplier_id,
            s.name AS supplier_name,
            p.material,
            p.color,
            p.pattern,
            p.price_per_yard,
            p.description,
            COALESCE(i.quantity, 0) AS quantity,
            p.created_at,
            p.updated_at
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.id
        INNER JOIN suppliers s
            ON p.supplier_id = s.id
        LEFT JOIN inventory i
            ON p.id = i.product_id
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
                OR p.pattern LIKE ?
            )
        `;

        const searchValue = `%${filters.search}%`;

        values.push(
            searchValue,
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

    // Color
    if (filters.color) {
        sql += ` AND p.color LIKE ?`;
        values.push(`%${filters.color}%`);
    }

    // Price range
    if (filters.min_price) {
        sql += ` AND p.price_per_yard >= ?`;
        values.push(filters.min_price);
    }

    if (filters.max_price) {
        sql += ` AND p.price_per_yard <= ?`;
        values.push(filters.max_price);
    }

    // Low stock
    if (filters.low_stock === "true") {
        sql += ` AND COALESCE(i.quantity, 0) <= 10`;
    }

    // Out of stock
    if (filters.out_of_stock === "true") {
        sql += ` AND COALESCE(i.quantity, 0) = 0`;
    }

    // Count total filtered products
    const countSql = `
        SELECT COUNT(*) AS total
        FROM (${sql}) AS filtered_products
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
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(
        sql,
        [...values, limit, offset]
    );

    return {
        products: rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getProductById = async (id) => {
    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.name,
            p.category_id,
            c.name AS category_name,
            p.supplier_id,
            s.name AS supplier_name,
            p.material,
            p.color,
            p.pattern,
            p.price_per_yard,
            p.description,
            p.created_at,
            p.updated_at
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.id
        INNER JOIN suppliers s
            ON p.supplier_id = s.id
        WHERE p.id = ?
    `, [id]);

    return rows[0];
};

const createProduct = async (
    name,
    categoryId,
    supplierId,
    material,
    color,
    pattern,
    pricePerYard,
    description
) => {
    const [result] = await pool.query(`
        INSERT INTO products (
            name,
            category_id,
            supplier_id,
            material,
            color,
            pattern,
            price_per_yard,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        name,
        categoryId,
        supplierId,
        material,
        color,
        pattern,
        pricePerYard,
        description
    ]);

    return result.insertId;
};

const updateProduct = async (
    id,
    name,
    categoryId,
    supplierId,
    material,
    color,
    pattern,
    pricePerYard,
    description
) => {
    const [result] = await pool.query(`
        UPDATE products
        SET
            name = ?,
            category_id = ?,
            supplier_id = ?,
            material = ?,
            color = ?,
            pattern = ?,
            price_per_yard = ?,
            description = ?
        WHERE id = ?
    `, [
        name,
        categoryId,
        supplierId,
        material,
        color,
        pattern,
        pricePerYard,
        description,
        id
    ]);

    return result;
};

const deleteProduct = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};