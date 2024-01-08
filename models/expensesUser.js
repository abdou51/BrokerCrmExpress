const mongoose = require("mongoose");
const expensesUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expensesConfig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpensesConfig",
      required: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
    validation: {
      type: String,
      enum: ["Hold", "Sent", "Approved"],
      default: "Hold",
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const ExpensesUser = mongoose.model("ExpensesUser", expensesUserSchema);

module.exports = ExpensesUser;
