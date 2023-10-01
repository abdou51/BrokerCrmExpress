const ExpensesUser = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    const createdProduct = await Product.create(productData);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating Product" });
    console.log(error);
  }
};

module.exports = {
  createProduct,
};
