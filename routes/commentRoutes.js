const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.post("/", userJwt, commentController.createComment);
router.get("/", userJwt, commentController.getComments);
router.put("/:id", userJwt, commentController.updateComment);
router.delete("/:id", userJwt, commentController.deleteComment);

module.exports = router;
