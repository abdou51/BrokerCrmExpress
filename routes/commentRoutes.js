const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Define routes

router.post("/", commentController.createComment);

module.exports = router;
