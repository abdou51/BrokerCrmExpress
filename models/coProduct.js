const mongoose = require("mongoose");

const coProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ug: {
      type: Number,
    },
    remise: {
      type: Number,
    },
    PPA: {
      type: Number,
      default: 0,
    },
    wholesalerPriceUnit: {
      type: Number,
      default: 0,
    },
    pharmacyPriceUnit: {
      type: Number,
      default: 0,
    },
    superWholesalerPriceUnit: {
      type: Number,
      default: 0,
    },
    collision: {
      type: Number,
      default: 0,
    },
    DDP: {
      type: Date,
    },
    isDrafted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CoProduct = mongoose.model("CoProduct", coProductSchema);

module.exports = CoProduct;
