const express = require("express");
const router = express.Router();
const delegateMonthController = require("../controllers/delegateMonthController");
const userJwt = require("../../middlewares/userJwt");

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
router.get("/tauxdereussite", userJwt, delegateMonthController.tauxDeReussite);
router.get(
  "/couverturePortefeuilleclient",
  userJwt,
  delegateMonthController.couverturePortefeuilleClient
);
router.get(
  "/objectifChiffreDaffaire",
  userJwt,
  delegateMonthController.objectifChiffreDaffaire
);

router.get(
  "/delegateChiffreDaffaireStats",
  userJwt,
  delegateMonthController.delegateChiffreDaffaireStats
);
router.get(
  "/venteParProduit",
  userJwt,
  delegateMonthController.venteParProduit
);
router.get("/venteParWilaya", userJwt, delegateMonthController.venteParWilaya);

module.exports = router;
