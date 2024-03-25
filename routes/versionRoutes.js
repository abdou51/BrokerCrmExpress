const express = require("express");
const router = express.Router();
const versionController = require("../controllers/versionController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, versionController.createVersion);
router.get("/", versionController.getVersion);

module.exports = router;
