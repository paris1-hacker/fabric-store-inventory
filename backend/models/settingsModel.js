const pool = require("../config/db");


// Get store settings

const getSettings = async () => {

    const [rows] = await pool.query(`
        SELECT
            id,
            store_name,
            updated_at
        FROM settings
        ORDER BY id ASC
        LIMIT 1
    `);

    return rows[0];

};


// Update store name

const updateStoreName = async (
    storeName
) => {

    const [existingRows] = await pool.query(`
        SELECT
            id
        FROM settings
        ORDER BY id ASC
        LIMIT 1
    `);


    if (existingRows.length === 0) {

        const [result] = await pool.query(`
            INSERT INTO settings (
                store_name
            )
            VALUES (?)
        `, [
            storeName
        ]);

        return result.insertId;

    }


    const settingsId =
        existingRows[0].id;


    await pool.query(`
        UPDATE settings
        SET
            store_name = ?
        WHERE id = ?
    `, [
        storeName,
        settingsId
    ]);


    return settingsId;

};


module.exports = {

    getSettings,

    updateStoreName

};