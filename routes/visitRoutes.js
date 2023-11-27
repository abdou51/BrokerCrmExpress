const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, visitController.createVisit);
router.delete("/:id/", userJwt, visitController.deleteVisit);
router.post("/clone", userJwt, visitController.cloneVisits);
router.get("/getTasks", userJwt, visitController.getTasks);

module.exports = router;
