const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Wholesaler", "Laboratory"],
      required: true,
    },
  },
  { versionKey: false }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
