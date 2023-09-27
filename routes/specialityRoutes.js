const express = require("express");
const router = express.Router();
const specialityController = require("../controllers/specialityController");

// Define routes

router.post("/", specialityController.createSpeciality);

module.exports = router;
