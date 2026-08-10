
const express = require("express");

const {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ============================================
// VIEW SUPPLIERS
// Authenticated users can view suppliers
// ============================================

router.get(
    "/",
    authMiddleware,
    getSuppliers
);


router.get(
    "/:id",
    authMiddleware,
    getSupplier
);


// ============================================
// CREATE SUPPLIER
// ADMIN ONLY
// ============================================

router.post(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN"),
    createSupplier
);


// ============================================
// UPDATE SUPPLIER
// ADMIN ONLY
// ============================================

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    updateSupplier
);


// ============================================
// DELETE SUPPLIER
// ADMIN ONLY
// ============================================

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteSupplier
);


module.exports = router;
