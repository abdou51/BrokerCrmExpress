const mongoose = require("mongoose");
const expensesDaySchema = new mongoose.Schema(
  {
    userExpense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserExpense", // Reference to the UserExpense model
    },
    totalVisitsDoctor: {
      type: Number,
      default: 0,
    },
    totalVisitsPharmacy: {
      type: Number,
      default: 0,
    },
    totalVisitsWholesaler: {
      type: Number,
      default: 0,
    },
    kmTotal: {
      type: Number,
      default: 0,
    },
    indemnityKm: {
      type: Number,
      default: 0,
    },
    nightsTotal: {
      type: Number,
      default: 0,
    },
    indemnityNights: {
      type: Number,
      default: 0,
    },
    otherExpenses: {
      type: Number,
      default: 0,
    },
    createdDate: {
      type: String,
    },
    startWilaya: {
      type: String,
    },
    endWilaya: {
      type: String,
    },
    startCommun: {
      type: String,
    },
    endCommun: {
      type: String,
    },
  },
  { versionKey: false }
);
const ExpensesDay = mongoose.model("ExpensesDay", expensesDaySchema);

module.exports = ExpensesDay;
