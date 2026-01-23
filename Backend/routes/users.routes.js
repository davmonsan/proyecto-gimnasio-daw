const express = require("express");
const multer = require("multer");
const usersController = require("../controllers/users.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/profile-images",
  filename: (req, file, cb) => {
  const ext = file.originalname.split(".").pop();
  cb(null, `user_${req.params.userId}.${ext}`);
}
});

const upload = multer({ storage });

router.post(
  "/users/:userId/profile-image",
  upload.single("image"),
  usersController.updateProfileImage
);

module.exports = router;
