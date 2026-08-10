const express = require("express");


const {
    getSettings,
    updateProfile,
    changePassword,
    updateStoreName
} = require("../controllers/settingsController");


const authMiddleware =
    require("../middleware/authMiddleware");


const router =
    express.Router();


// Get current settings

router.get(
    "/",
    authMiddleware,
    getSettings
);


// Update own profile

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// Change own password

router.put(
    "/password",
    authMiddleware,
    changePassword
);


// Update store name

router.put(
    "/store",
    authMiddleware,
    updateStoreName
);


module.exports = router;