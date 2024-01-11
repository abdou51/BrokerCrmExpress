const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");
const userJwt = require("../middlewares/userJwt");

router.post("/", userJwt, commandController.createCommand);
router.get("/:id", userJwt, commandController.getCommandById);
router.put("/:id", userJwt, commandController.updateCommand);
router.get("/", userJwt, commandController.getCommands);

module.exports = router;
