const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// Define routes

router.post("/", serviceController.createService);

module.exports = router;
