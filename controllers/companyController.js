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
    console.error(error);
    res.status(500).json({ error: "Error creating Company" });
  }
};
const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne();
    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting Company" });
  }
};
module.exports = {
  createCompany,
  getCompany,
};
