const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/profile", auth, userController.getProfile);
router.put(
  "/profile",
  auth,
  upload.single("profilePicture"),
  userController.updateProfile
);

module.exports = router;
