const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Define routes

router.post("/", clientController.createClient);
router.get("/:id", clientController.getClientById);

module.exports = router;
