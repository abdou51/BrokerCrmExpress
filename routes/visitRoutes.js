const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, visitController.createVisit);
router.delete("/:id", userJwt, visitController.deleteVisit);

module.exports = router;
