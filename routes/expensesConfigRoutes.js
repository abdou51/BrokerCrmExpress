const express = require("express");
const router = express.Router();
const expensesConfigController = require("../controllers/expensesConfigController");

// Define routes

router.post("/", expensesConfigController.createExpensesConfig);

module.exports = router;
