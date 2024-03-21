const mongoose = require("mongoose");
const expensesDaySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    totalExpense: {
      type: Number,
      default: 0,
    },
    proofs: [
      {
        proof: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "File",
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
      get: (date) => {
        if (date) {
          const localDate = new Date(date);
          localDate.setHours(localDate.getHours() + 1);
          return localDate;
        }
        return date;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);
const ExpensesDay = mongoose.model("ExpensesDay", expensesDaySchema);

module.exports = ExpensesDay;
