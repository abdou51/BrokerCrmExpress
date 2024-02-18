const CoProduct = require("../models/coProduct");

const createCoProduct = async (req, res) => {
  try {
    const coProductData = { ...req.body };
    const createdCoProduct = await CoProduct.create(coProductData);

    res.status(201).json(createdCoProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating CoProduct" });
  }
};

const updateCoProduct = async (req, res) => {
  try {
    const updatedProduct = await CoProduct.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating Product" });
  }
};

const deleteCoProduct = async (req, res) => {
  try {
    const deletedProduct = await CoProduct.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting Product" });
  }
};
const getCoProducts = async (req, res) => {
  try {
    const products = await CoProduct.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting Products" });
  }
};

module.exports = {
  createCoProduct,
  updateCoProduct,
  deleteCoProduct,
  getCoProducts,
};
