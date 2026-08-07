const express = require("express");

const {
    getInventory,
    getProductInventory,
    stockIn,
    stockOut,
    getMovements
} = require("../controllers/inventoryController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validateStock = require("../middleware/validateStock");

const router = express.Router();

// Anyone authenticated can view inventory
router.get(
    "/",
    authMiddleware,
    getInventory
);

router.get(
    "/movements",
    authMiddleware,
    getMovements
);

router.get(
    "/product/:productId",
    authMiddleware,
    getProductInventory
);

// Only ADMIN and STAFF can modify stock
// router.post(
//     "/stock-in",
//     authMiddleware,
//     authorizeRoles("ADMIN", "STAFF"),
//     stockIn
// );

// router.post(
//     "/stock-out",
//     authMiddleware,
//     authorizeRoles("ADMIN", "STAFF"),
//     stockOut
// );



router.post(
    "/stock-in",
    authMiddleware,
    authorizeRoles("ADMIN", "STAFF"),
    validateStock,
    stockIn
);

router.post(
    "/stock-out",
    authMiddleware,
    authorizeRoles("ADMIN", "STAFF"),
    validateStock,
    stockOut
);
module.exports = router;