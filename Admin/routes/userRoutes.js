const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.post("/", userJwt, userController.getUsers);
router.post("/register", userJwt, userController.registerUser);
router.get("/supervisors", userJwt, userController.getSupervisors);

module.exports = router;
