const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const userJwt = require("../middlewares/userJwt");
// Define routes

router.post("/", userJwt, productController.createProduct);
router.get("/", userJwt, productController.getProducts);
router.put("/:id", userJwt, productController.updateProduct);
router.delete("/:id", userJwt, productController.deleteProduct);

module.exports = router;
