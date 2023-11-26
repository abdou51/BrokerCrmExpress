const express = require("express");
const router = express.Router();
const establishmentController = require("../controllers/establishmentController");

// Define routes

router.post("/", establishmentController.createEstablishment);

module.exports = router;
