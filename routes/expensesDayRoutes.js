const express = require("express");
const router = express.Router();
const expensesDayController = require("../controllers/expensesDayController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.get("/", userJwt, expensesDayController.getExpensesDay);

module.exports = router;
