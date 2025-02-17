const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");
const { upload } = require("../Middleware/multer");

const router = express.Router();

// Route to get user profile
router.get("/profile", authMiddleware, getProfile);

// Route to update user profile (with image upload)
router.put("/profile", authMiddleware, upload.single("profileImage"), updateProfile);

module.exports = router;
