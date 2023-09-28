const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

// Define routes

router.post("/", companyController.createCompany);

module.exports = router;
