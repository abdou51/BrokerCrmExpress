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
    userValidation: {
      type: Boolean,
      default: false,
    },
    adminValidation: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);
const ExpensesUser = mongoose.model("ExpensesUser", expensesUserSchema);

module.exports = ExpensesUser;
