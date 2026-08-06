const express = require("express");

const {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const router = express.Router();

router.get("/", getSuppliers);

router.get("/:id", getSupplier);

router.post("/", createSupplier);

router.put("/:id", updateSupplier);

router.delete("/:id", deleteSupplier);

module.exports = router;