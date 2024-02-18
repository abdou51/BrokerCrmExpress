const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userJwt = require("../middlewares/userJwt");

// Define routes

router.get("/me", userJwt, userController.getMe);
router.post("/login", userController.loginUser);
router.put("/:id/", userJwt, userController.updateUser);
router.post("/portfolio/add", userJwt, userController.addClientToPortfolio);
router.post("/portfolio", userJwt, userController.getPortfolio);
router.post("/universe", userJwt, userController.getUniverse);
router.delete(
  "/portfolio/remove",
  userJwt,
  userController.removeClientFromPortfolio
);

module.exports = router;
