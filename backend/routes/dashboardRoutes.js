const express = require("express");

const {
    getSummary,
    getLowStockProducts,
    getRecentMovements
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/summary",
    authMiddleware,
    getSummary
);

router.get(
    "/low-stock",
    authMiddleware,
    getLowStockProducts
);

router.get(
    "/recent-movements",
    authMiddleware,
    getRecentMovements
);

module.exports = router;