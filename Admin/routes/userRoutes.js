const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.get("/", userJwt, userController.getUsers);
router.post("/register", userJwt, userController.registerUser);

module.exports = router;
