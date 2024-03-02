const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.get("/", userJwt, clientController.getClients);
router.get("/filter", userJwt, clientController.getWholesalers);

module.exports = router;
