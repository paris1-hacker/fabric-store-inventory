const pool = require("../config/db");

const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            password,
            role,
            created_at
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0];
};

const createUser = async (
    name,
    email,
    hashedPassword,
    role = "STAFF"
) => {
    const [result] = await pool.query(
        `
        INSERT INTO users (
            name,
            email,
            password,
            role
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            email,
            hashedPassword,
            role
        ]
    );

    return result.insertId;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};