const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");
const { upload } = require("../Middleware/multer");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, upload.single("profileImage"), updateProfile);

module.exports = router;
