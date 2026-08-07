
const express = require("express");
const cors = require("cors");



const errorHandler = require("./middleware/errorMiddleware");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Fabric Store Inventory API is running"
    });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);


module.exports = app;