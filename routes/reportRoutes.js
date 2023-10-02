const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, reportController.createReport);
router.get("/:id", reportController.getReportById);
router.put("/:id", userJwt, reportController.updateReport);

module.exports = router;
