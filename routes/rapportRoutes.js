const express = require("express");
const router = express.Router();
const rapportController = require("../controllers/rapportController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, rapportController.createRapport);
router.get("/:id", rapportController.getRapportById);
router.put("/:id", userJwt, rapportController.updateRapport);

module.exports = router;
