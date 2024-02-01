const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.get("/", userJwt, clientController.getClients);

module.exports = router;
