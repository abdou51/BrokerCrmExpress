const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goalController");

// Define routes

router.post("/", goalController.createGoal);

module.exports = router;
