const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");
const userJwt = require("../middlewares/userJwt");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/commands");
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname;
    const filename = `${Date.now()}_${originalname.replace(/ /g, "_")}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  userJwt,
  upload.single("signature"),
  commandController.createCommand
);
router.get("/:id", userJwt, commandController.getCommandById);

module.exports = router;