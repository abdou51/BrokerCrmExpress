const Company = require("../models/company");

const createCompany = async (req, res) => {
  try {
    const newCompany = new Company({
      name: req.body.name,
      type: req.body.type,
    });

    const createdCompany = await newCompany.save();

    res.status(201).json(createdCompany);
  } catch (error) {
    res.status(500).json({ error: "Error creating Company" });
    console.error(error);
  }
};
const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne();
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: "Error getting Company" });
    console.error(error);
  }
};
module.exports = {
  createCompany,
  getCompany,
};
