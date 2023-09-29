const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/commands");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Math.round(Math.random() * 1e10);
    cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), commandController.createCommand);

module.exports = router;
