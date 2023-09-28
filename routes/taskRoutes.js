const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.post("/", userJwt, taskController.createTask);
router.delete("/:id", userJwt, taskController.deleteTask);
router.get("/today", userJwt, taskController.getTodaysTasks);
router.post("/clone", userJwt, taskController.cloneTasks);

module.exports = router;
