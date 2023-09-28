const express = require("express");
const router = express.Router();
const motivationController = require("../controllers/motivationController");

// Define routes

router.post("/", motivationController.createMotivation);

module.exports = router;
