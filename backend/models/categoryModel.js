const pool = require("../config/db");

const getAllCategories = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM categories ORDER BY created_at DESC"
    );

    return rows;
};

const getCategoryById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
    );

    return rows[0];
};

const createCategory = async (name, description) => {
    const [result] = await pool.query(
        `INSERT INTO categories (name, description)
         VALUES (?, ?)`,
        [name, description]
    );

    return result.insertId;
};

const updateCategory = async (id, name, description) => {
    const [result] = await pool.query(
        `UPDATE categories
         SET name = ?, description = ?
         WHERE id = ?`,
        [name, description, id]
    );

    return result;
};

const deleteCategory = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM categories WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};