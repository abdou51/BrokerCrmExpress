const express = require("express");
const router = express.Router();
const adminMonthController = require("../controllers/adminMonthController");
const userJwt = require("../../middlewares/userJwt");

// Define routes

router.get(
  "/classementChiffreDaffaireSupervisors",
  userJwt,
  adminMonthController.classementChiffreDaffaireSupervisors
);

module.exports = router;
