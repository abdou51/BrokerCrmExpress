const express = require("express");
const router = express.Router();
const delegateYearController = require("../controllers/delegateYearController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.get("/yearlyStats", userJwt, delegateYearController.yearlyStats);
router.get(
  "/contributionChiffreDaffaireAnnuel",
  userJwt,
  delegateYearController.contributionChiffreDaffaireAnnuel
);

module.exports = router;
