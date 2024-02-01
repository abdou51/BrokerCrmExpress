const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.get("/", userJwt, userController.getUsers);

module.exports = router;
