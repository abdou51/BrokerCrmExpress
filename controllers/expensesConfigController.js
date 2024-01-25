const ExpensesConfig = require("../models/expensesConfig");

const createExpensesConfig = async (req, res) => {
  try {
    const newExpensesConfig = new ExpensesConfig({
      ...req.body,
    });

    const createdExpensesConfig = await newExpensesConfig.save();

    res.status(201).json(createdExpensesConfig);
  } catch (error) {
    res.status(500).json({ error: "Error creating expenses Config" });
    console.error(error);
  }
};
const updateExpensesConfig = async (req, res) => {
  try {
    const expensesConfigId = req.params.id;
    const expensesConfig = await ExpensesConfig.findById(expensesConfigId);
    if (!expensesConfig) {
      return res.status(404).json({ error: "Expenses Config not found." });
    }
    const updatedExpensesConfig = await ExpensesConfig.findByIdAndUpdate(
      expensesConfigId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedExpensesConfig);
  } catch (error) {
    res.status(500).json({ error: "Error updating the expenses Config" });
    console.error(error);
  }
};
const getExpensesConfig = async (req, res) => {
  try {
    const expensesConfig = await ExpensesConfig.findOne();
    res.status(200).json(expensesConfig);
  } catch (error) {
    res.status(500).json({ error: "Error getting the expenses Config" });
    console.error(error);
  }
};

module.exports = {
  createExpensesConfig,
  updateExpensesConfig,
  getExpensesConfig,
};
