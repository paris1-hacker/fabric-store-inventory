const express = require("express");
const validateProduct = require("../middleware/validateProduct");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

// router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN"),
    validateProduct,
    createProduct
);

module.exports = router;