const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["product", "coproduct"],
      required: true,
    },
    ug: {
      type: Number,
    },
    remise: {
      type: Number,
    },
    grossistPriceUnit: {
      type: Number,
    },
    pharmacyPriceUnit: {
      type: Number,
    },
    superGrossistPriceUnit: {
      type: Number,
    },
    collisage: {
      type: Number,
    },
    DDP: {
      type: String,
    },
    isDrafted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
