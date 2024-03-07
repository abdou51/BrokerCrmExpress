const express = require("express");
const router = express.Router();
const userTrackingController = require("../controllers/userTrackingController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.post("/", userJwt, userTrackingController.createUserTracking);

module.exports = router;
