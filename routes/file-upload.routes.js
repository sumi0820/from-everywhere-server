const express = require("express");
const router = express.Router();

// include CLOUDINARY:
const uploader = require("../config/cloudinary.config.js");

router.post("/upload", uploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    res.json();
  } else {
    res.json({ image: req.file.path });
  }
});

module.exports = router;
