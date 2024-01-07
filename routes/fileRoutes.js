const express = require("express");
const router = express.Router();
const fileUploadController = require("../controllers/fileUploadController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, fileUploadController.uploadImage);
router.get("/", userJwt, fileUploadController.getFiles);

module.exports = router;
