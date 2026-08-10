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

router.get("/", getSuppliers, authMiddleware);

router.get("/:id", getSupplier, authMiddleware);

router.post("/", createSupplier, authMiddleware, authorizeRoles("ADMIN"));

router.put("/:id", updateSupplier, authMiddleware, authorizeRoles("ADMIN"));

router.delete("/:id", deleteSupplier, authMiddleware, authorizeRoles("ADMIN"));

module.exports = router;

