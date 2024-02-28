const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.post("/", userJwt, planController.getPlan);

module.exports = router;
