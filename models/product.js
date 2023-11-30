const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Product", "Coproduct"],
      required: true,
    },
    ug: {
      type: Number,
    },
    remise: {
      type: Number,
    },
    wholesalerPriceUnit: {
      type: Number,
    },
    pharmacyPriceUnit: {
      type: Number,
    },
    superWholesalerPriceUnit: {
      type: Number,
    },
    collision: {
      type: Number,
    },
    DDP: {
      type: String,
    },
    isDrafted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
