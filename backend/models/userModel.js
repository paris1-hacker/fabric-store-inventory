const pool = require("../config/db");


// Get all users
const getAllUsers = async () => {

    const [rows] = await pool.query(`
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
    `);

    return rows;

};


// Get one user by ID
const getUserById = async (id) => {

    const [rows] = await pool.query(`
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE id = ?
        LIMIT 1
    `, [id]);

    return rows[0];

};


// Find user by email
const findUserByEmail = async (email) => {

    const [rows] = await pool.query(`
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
    `, [email]);

    return rows[0];

};


// Create user
const createUser = async (
    name,
    email,
    hashedPassword,
    role = "STAFF"
) => {

    const [result] = await pool.query(`
        INSERT INTO users (
            name,
            email,
            password,
            role
        )
        VALUES (?, ?, ?, ?)
    `, [
        name,
        email,
        hashedPassword,
        role
    ]);

    return result.insertId;

};


// Update user
const updateUser = async (
    id,
    name,
    email,
    role
) => {

    const [result] = await pool.query(`
        UPDATE users
        SET
            name = ?,
            email = ?,
            role = ?
        WHERE id = ?
    `, [
        name,
        email,
        role,
        id
    ]);

    return result;

};


// Update user with password
const updateUserWithPassword = async (
    id,
    name,
    email,
    hashedPassword,
    role
) => {

    const [result] = await pool.query(`
        UPDATE users
        SET
            name = ?,
            email = ?,
            password = ?,
            role = ?
        WHERE id = ?
    `, [
        name,
        email,
        hashedPassword,
        role,
        id
    ]);

    return result;

};


// Delete user
const deleteUser = async (id) => {

    const [result] = await pool.query(`
        DELETE FROM users
        WHERE id = ?
    `, [id]);

    return result;

};


module.exports = {

    getAllUsers,
    getUserById,
    findUserByEmail,
    createUser,
    updateUser,
    updateUserWithPassword,
    deleteUser

};