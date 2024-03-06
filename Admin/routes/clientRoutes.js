const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.post("/", userJwt, clientController.getClients);
router.get("/filter", userJwt, clientController.getWholesalers);
router.get("/users", userJwt, clientController.getClientUsers);

module.exports = router;
