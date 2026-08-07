const express = require("express");

const {
    getInventory,
    getProductInventory,
    stockIn,
    stockOut,
    getMovements
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getInventory);

router.get("/movements", getMovements);

router.get("/product/:productId", getProductInventory);

router.post("/stock-in", stockIn);

router.post("/stock-out", stockOut);

module.exports = router;