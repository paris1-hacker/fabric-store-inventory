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

router.post("/", createSupplier, authorizeRoles("ADMIN"), authMiddleware);

router.put("/:id", updateSupplier,authorizeRoles("ADMIN"),  authMiddleware, );

router.delete("/:id", deleteSupplier,authorizeRoles("ADMIN"), authMiddleware, );

module.exports = router;

