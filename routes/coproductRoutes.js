const express = require("express");
const router = express.Router();
const coproductController = require("../controllers/coproductController");

// Define routes

router.post("/", coproductController.createCoproduct);

module.exports = router;
