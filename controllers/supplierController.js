const Supplier = require("../models/supplier");

const createSupplier = async (req, res) => {
  try {
    const supplierData = { ...req.body };
    const createdSupplier = await Supplier.create(supplierData);

    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(500).json({ error: "Error creating Supplier" });
    console.error(error);
  }
};

module.exports = {
  createSupplier,
};
