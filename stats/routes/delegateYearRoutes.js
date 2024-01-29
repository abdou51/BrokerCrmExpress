const express = require("express");
const router = express.Router();
const delegateYearController = require("../controllers/delegateYearController");
const userJwt = require("../../middlewares/userJwt");

// Define routes

router.get("/planDeTournee", userJwt, delegateYearController.planDeTournee);
router.get("/tauxDeReussite", userJwt, delegateYearController.tauxDeReussite);
router.get(
  "/contributionChiffreDaffaireAnnuel",
  userJwt,
  delegateYearController.contributionChiffreDaffaireAnnuel
);

module.exports = router;
