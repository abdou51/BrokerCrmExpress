const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const userJwt = require("../middlewares/userJwt");

// Define routes
router.get("/", userJwt, clientController.getAllClients);
router.post("/", userJwt, clientController.createClient);
router.get("/:id", userJwt, clientController.getClientById);
router.put("/:id", userJwt, clientController.updateClient);

module.exports = router;
