const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Pharm", "Parapharm"],
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
      type: String,
    },
    phoneNumberTwo: {
      type: String,
    },
    isDrafted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
