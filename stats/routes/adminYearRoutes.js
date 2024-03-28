const express = require("express");
const router = express.Router();
const adminYearController = require("../controllers/adminYearController");
const userJwt = require("../../middlewares/userJwt");

// Define routes

router.get(
  "/contributionChiffreDaffaireAnnuel",
  userJwt,
  adminYearController.contributionChiffreDaffaireAnnuel
);

router.get("/yearlyStats", userJwt, adminYearController.yearlyStats);
module.exports = router;
