const express = require("express");
const router = express.Router();
const supervisorYearController = require("../controllers/supervisorYearController");
const userJwt = require("../../middlewares/userJwt");

// Define routes

router.get("/yearlyStats", userJwt, supervisorYearController.yearlyStats);

router.get(
  "/contributionChiffreDaffaireAnnuel",
  userJwt,
  supervisorYearController.contributionChiffreDaffaireAnnuel
);
router.get(
  "/contributionEquipeAnnuel",
  userJwt,
  supervisorYearController.contributionEquipeAnnuel
);

module.exports = router;
