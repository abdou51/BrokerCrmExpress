const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// Define routes

router.post("/", supplierController.createSupplier);

module.exports = router;
