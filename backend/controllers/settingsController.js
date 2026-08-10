const bcrypt = require("bcryptjs");

const pool = require("../config/db");

const authModel = require("../models/authModel");

const settingsModel =
    require("../models/settingsModel");



// Get settings

const getSettings = async (
    req,
    res,
    next
) => {

    try {

        const settings =
            await settingsModel.getSettings();


        const user =
            await authModel.findUserById(
                req.user.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        res.status(200).json({

            success: true,

            data: {

                profile: {

                    id: user.id,

                    name: user.name,

                    email: user.email,

                    role: user.role,

                    created_at:
                        user.created_at

                },

                system: settings

            }

        });

    } catch (error) {

        next(error);

    }

};



// Update profile

const updateProfile = async (
    req,
    res,
    next
) => {

    try {

        const {
            name,
            email
        } = req.body;


        if (
            !name ||
            name.trim() === ""
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required"

            });

        }


        if (
            !email ||
            email.trim() === ""
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required"

            });

        }


        const existingUser =
            await authModel.findUserById(
                req.user.id
            );


        if (!existingUser) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const emailUser =
            await authModel.findUserByEmail(
                email.trim()
            );


        if (
            emailUser &&
            Number(emailUser.id) !==
                Number(req.user.id)
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already belongs to another user"

            });

        }


        await pool.query(`
            UPDATE users
            SET
                name = ?,
                email = ?
            WHERE id = ?
        `, [
            name.trim(),
            email.trim(),
            req.user.id
        ]);


        const updatedUser =
            await authModel.findUserById(
                req.user.id
            );


        res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            data: updatedUser

        });

    } catch (error) {

        next(error);

    }

};



// Change password

const changePassword = async (
    req,
    res,
    next
) => {

    try {

        const {
            current_password,
            new_password
        } = req.body;


        if (
            !current_password ||
            !new_password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password and new password are required"

            });

        }


        if (
            new_password.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters"

            });

        }


        const user =
            await authModel.findUserByEmail(
                (
                    await authModel.findUserById(
                        req.user.id
                    )
                ).email
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                current_password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Current password is incorrect"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                new_password,
                10
            );


        await pool.query(`
            UPDATE users
            SET
                password = ?
            WHERE id = ?
        `, [
            hashedPassword,
            req.user.id
        ]);


        res.status(200).json({

            success: true,

            message:
                "Password changed successfully"

        });

    } catch (error) {

        next(error);

    }

};



// Update store name

const updateStoreName = async (
    req,
    res,
    next
) => {

    try {

        const {
            store_name
        } = req.body;


        if (
            !store_name ||
            store_name.trim() === ""
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Store name is required"

            });

        }


        if (
            store_name.trim().length > 150
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Store name must not exceed 150 characters"

            });

        }


        await settingsModel.updateStoreName(
            store_name.trim()
        );


        const settings =
            await settingsModel.getSettings();


        res.status(200).json({

            success: true,

            message:
                "Store name updated successfully",

            data: settings

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    getSettings,

    updateProfile,

    changePassword,

    updateStoreName

};