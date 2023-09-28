const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["pharm", "parapharm"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    wilaya: {
      type: String,
    },
    commun: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumberOne: {
      type: Number,
    },
    phoneNumberTwo: {
      type: Number,
    },
  },
  { versionKey: false }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
