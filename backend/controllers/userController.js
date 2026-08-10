const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");


// Get all users
const getUsers = async (req, res, next) => {

    try {

        const users =
            await userModel.getAllUsers();

        res.status(200).json({

            success: true,

            data: users

        });

    } catch (error) {

        next(error);

    }

};


// Get one user
const getUser = async (req, res, next) => {

    try {

        const { id } = req.params;

        const user =
            await userModel.getUserById(id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        res.status(200).json({

            success: true,

            data: user

        });

    } catch (error) {

        next(error);

    }

};


// Create user
const createUser = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Name is required"

            });

        }


        if (!email || email.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Email is required"

            });

        }


        if (!password) {

            return res.status(400).json({

                success: false,

                message: "Password is required"

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        const selectedRole =
            role || "STAFF";


        if (
            selectedRole !== "ADMIN" &&
            selectedRole !== "STAFF"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Role must be ADMIN or STAFF"

            });

        }


        const existingUser =
            await userModel.findUserByEmail(
                email.trim()
            );


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already registered"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const userId =
            await userModel.createUser(
                name.trim(),
                email.trim(),
                hashedPassword,
                selectedRole
            );


        const newUser =
            await userModel.getUserById(
                userId
            );


        res.status(201).json({

            success: true,

            message:
                "User created successfully",

            data: newUser

        });

    } catch (error) {

        next(error);

    }

};


// Update user
const updateUser = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            name,
            email,
            password,
            role
        } = req.body;


        const existingUser =
            await userModel.getUserById(id);


        if (!existingUser) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        if (!name || name.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Name is required"

            });

        }


        if (!email || email.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Email is required"

            });

        }


        const selectedRole =
            role || existingUser.role;


        if (
            selectedRole !== "ADMIN" &&
            selectedRole !== "STAFF"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Role must be ADMIN or STAFF"

            });

        }


        const emailUser =
            await userModel.findUserByEmail(
                email.trim()
            );


        if (
            emailUser &&
            Number(emailUser.id) !== Number(id)
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already belongs to another user"

            });

        }


        if (password && password.trim() !== "") {

            if (password.length < 6) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters"

                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            await userModel.updateUserWithPassword(

                id,

                name.trim(),

                email.trim(),

                hashedPassword,

                selectedRole

            );

        } else {

            await userModel.updateUser(

                id,

                name.trim(),

                email.trim(),

                selectedRole

            );

        }


        const updatedUser =
            await userModel.getUserById(id);


        res.status(200).json({

            success: true,

            message:
                "User updated successfully",

            data: updatedUser

        });

    } catch (error) {

        next(error);

    }

};


// Delete user
const deleteUser = async (req, res, next) => {

    try {

        const { id } = req.params;


        const existingUser =
            await userModel.getUserById(id);


        if (!existingUser) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // Prevent an admin from deleting themselves
        if (
            Number(req.user.id) === Number(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot delete your own account"

            });

        }


        await userModel.deleteUser(id);


        res.status(200).json({

            success: true,

            message:
                "User deleted successfully"

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser

};