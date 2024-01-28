const express = require("express");
const router = express.Router();
const supervisorMonthController = require("../controllers/supervisorMonthController");
const userJwt = require("../../middlewares/userJwt");

// Define routes

router.get(
  "/supervisorchiffredaffairestats",
  userJwt,
  supervisorMonthController.supervisorChiffreDaffaireStats
);
router.get(
  "/classementchiffredaffaireequipe",
  userJwt,
  supervisorMonthController.classementChiffreDaffaireEquipe
);

module.exports = router;
