const express = require("express");
const router = express.Router();
const wilayaController = require("../controllers/wilayaController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.post("/", userJwt, wilayaController.createWilaya);
router.get("/", userJwt, wilayaController.getWilayas);

module.exports = router;
