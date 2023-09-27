const express = require("express");
const router = express.Router();
const wilayaController = require("../controllers/wilayaController");

// Define routes

router.post("/", wilayaController.createWilaya);

module.exports = router;
