const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    const createdProduct = await Product.create(productData);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating Product" });
    console.error(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error updating Product" });
    console.error(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error deleting Product" });
    console.error(error);
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error getting Products" });
    console.error(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
};
