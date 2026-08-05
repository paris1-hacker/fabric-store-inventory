
const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Fabric Store Inventory API is running"
    });
});

app.use("/api/categories", categoryRoutes);

module.exports = app;