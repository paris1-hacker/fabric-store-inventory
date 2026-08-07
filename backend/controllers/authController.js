const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authModel = require("../models/authModel");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

// register function
const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser =
            await authModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const userId = await authModel.createUser(
            name,
            email,
            hashedPassword,
            role || "STAFF"
        );

        const user = {
            id: userId,
            name,
            email,
            role: role || "STAFF"
        };

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

// login function
const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user =
            await authModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

// get the current user
const getMe = async (req, res, next) => {
    try {
        const user =
            await authModel.findUserById(req.user.id);

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


module.exports = {
    register,
    login,
    getMe
};