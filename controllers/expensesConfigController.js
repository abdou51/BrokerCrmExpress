const ExpensesConfig = require("../models/expensesConfig");

const createExpensesConfig = async (req, res) => {
  try {
    const newExpensesConfig = new ExpensesConfig({
      kmPrice: req.body.kmPrice,
      nightPrice: req.body.nightPrice,
    });

    const createdExpensesConfig = await newExpensesConfig.save();

    res.status(201).json(createdExpensesConfig);
  } catch (error) {
    res.status(500).json({ error: "Error creating expenses Config" });
    console.error(error);
  }
};

module.exports = {
  createExpensesConfig,
};
