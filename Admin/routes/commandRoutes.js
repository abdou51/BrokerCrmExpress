const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.post("/", userJwt, commandController.getCommandsByUserAndMonth);

module.exports = router;
