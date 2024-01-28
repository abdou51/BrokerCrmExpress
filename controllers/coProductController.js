const CoProduct = require("../models/coProduct");

const createCoProduct = async (req, res) => {
  try {
    const coProductData = { ...req.body };
    const createdCoProduct = await CoProduct.create(coProductData);

    res.status(201).json(createdCoProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating CoProduct" });
    console.error(error);
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
    res.status(500).json({ error: "Error updating Product" });
    console.error(error);
  }
};

const deleteCoProduct = async (req, res) => {
  try {
    const deletedProduct = await CoProduct.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error deleting Product" });
    console.error(error);
  }
};
const getCoProducts = async (req, res) => {
  try {
    const products = await CoProduct.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error getting Products" });
    console.error(error);
  }
};

module.exports = {
  createCoProduct,
  updateCoProduct,
  deleteCoProduct,
  getCoProducts,
};
