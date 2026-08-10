const express = require("express");

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const authMiddleware =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");


const router = express.Router();


// Only authenticated ADMIN users can manage users

router.get(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getUsers
);


router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getUser
);


router.post(
    "/",
    authMiddleware,
    authorizeRoles("ADMIN"),
    createUser
);


router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    updateUser
);


router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteUser
);


module.exports = router;