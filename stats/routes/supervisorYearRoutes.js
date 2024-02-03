const express = require("express");
const router = express.Router();
const supervisorYearController = require("../controllers/supervisorYearController");
const userJwt = require("../../middlewares/userJwt");

// Define routes

router.get("/planDeTournee", userJwt, supervisorYearController.planDeTournee);
router.get(
  "/contributionChiffreDaffaireAnnuel",
  userJwt,
  supervisorYearController.contributionChiffreDaffaireAnnuel
);

module.exports = router;
