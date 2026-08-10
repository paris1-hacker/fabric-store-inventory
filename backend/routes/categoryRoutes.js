const express = require("express");

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const authMiddleware =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// CATEGORY ROUTES
// ===============================

// Authenticated users can VIEW categories

router.get(
    "/",
    authMiddleware,
    getCategories
);

router.get(
    "/:id",
    authMiddleware,
    getCategory
);


// Only ADMIN can CREATE categories

router.post(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN"),
    createCategory
);


// Only ADMIN can EDIT categories

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    updateCategory
);


// Only ADMIN can DELETE categories

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteCategory
);


module.exports = router;