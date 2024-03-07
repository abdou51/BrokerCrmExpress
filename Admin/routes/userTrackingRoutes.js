const express = require("express");
const router = express.Router();
const userTrackingController = require("../controllers/userTrackingController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.get("/", userJwt, userTrackingController.getTrackingPerDay);

module.exports = router;
