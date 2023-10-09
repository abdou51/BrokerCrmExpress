const express = require("express");
const router = express.Router();
const delegateMonthController = require("../stats/delegateMonthController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.get("/planDeTournee", userJwt, delegateMonthController.planDeTournee);
router.get(
  "/objectifVisites",
  userJwt,
  delegateMonthController.objectifVisites
);
router.get(
  "/moyenneVisitesParJour",
  userJwt,
  delegateMonthController.moyenneVisitesParJour
);
router.get(
  "/objectifChiffreDaffaire",
  userJwt,
  delegateMonthController.objectifChiffreDaffaire
);

module.exports = router;
