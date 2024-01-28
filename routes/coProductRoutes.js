const express = require("express");
const router = express.Router();
const coProductController = require("../controllers/coProductController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.post("/", userJwt, coProductController.createCoProduct);
router.get("/", userJwt, coProductController.getCoProducts);
router.put("/:id", userJwt, coProductController.updateCoProduct);
router.delete("/:id", userJwt, coProductController.deleteCoProduct);

module.exports = router;
