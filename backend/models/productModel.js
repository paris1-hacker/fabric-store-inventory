const pool = require("../config/db");

const getAllProducts = async () => {
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
        ORDER BY p.created_at DESC
    `);

    return rows;
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