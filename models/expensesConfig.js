const mongoose = require("mongoose");

const expensesConfigSchema = new mongoose.Schema(
  {
    kmPrice: {
      type: Number,
      default: 0,
    },
    nightPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ExpensesConfig = mongoose.model("ExpensesConfig", expensesConfigSchema);

module.exports = ExpensesConfig;
