const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const userJwt = require("../../middlewares/userJwt");

// Define routes
router.post("/", userJwt, todoController.createTodo);
router.get("/", userJwt, todoController.getTodosPerMonth);

module.exports = router;
