const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./middleware/errorMiddleware");

const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// FRONTEND
// ===============================

// Serve frontend files
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ===============================
// API ROUTES
// ===============================

app.use("/api/categories", categoryRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/products", productRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userRoutes);

app.use("/api/settings", settingsRoutes);


// ===============================
// ROOT PAGE
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


module.exports = app;