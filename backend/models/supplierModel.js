const pool = require("../config/db");

const getAllSuppliers = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM suppliers ORDER BY created_at DESC"
    );

    return rows;
};

const getSupplierById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM suppliers WHERE id = ?",
        [id]
    );

    return rows[0];
};

const createSupplier = async (
    name,
    contactPerson,
    phone,
    email,
    address
) => {
    const [result] = await pool.query(
        `INSERT INTO suppliers
        (name, contact_person, phone, email, address)
        VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            contactPerson,
            phone,
            email,
            address
        ]
    );

    return result.insertId;
};

const updateSupplier = async (
    id,
    name,
    contactPerson,
    phone,
    email,
    address
) => {
    const [result] = await pool.query(
        `UPDATE suppliers
        SET name = ?,
            contact_person = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE id = ?`,
        [
            name,
            contactPerson,
            phone,
            email,
            address,
            id
        ]
    );

    return result;
};

const deleteSupplier = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM suppliers WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};

