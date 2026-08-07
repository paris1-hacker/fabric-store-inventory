const errorHandler = (err, req, res, next) => {
    console.error(err);

    // MySQL duplicate entry
    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "Duplicate record already exists"
        });
    }

    // Foreign key constraint
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
            success: false,
            message: "Referenced record does not exist"
        });
    }

    // Generic error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;