const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directory
const uploadDir = path.join(__dirname, "../public/temp");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.access(uploadDir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error("No write access to the directory:", uploadDir);
        return cb(new Error("No write access"), null);
      }
      console.log("Write access confirmed for directory:", uploadDir);
      cb(null, uploadDir);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Export upload middleware
const upload = multer({ storage });

module.exports = { upload };
