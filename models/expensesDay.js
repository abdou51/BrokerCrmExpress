const mongoose = require("mongoose");
const expensesDaySchema = new mongoose.Schema(
  {
    userExpense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserExpense",
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
      default: null,
    },
    endWilaya: {
      type: String,
      default: null,
    },
    startCity: {
      type: String,
      default: null,
    },
    endCity: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);
const ExpensesDay = mongoose.model("ExpensesDay", expensesDaySchema);

module.exports = ExpensesDay;
