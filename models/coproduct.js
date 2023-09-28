const mongoose = require("mongoose");

const coproductSchema = new mongoose.Schema(
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
  },
  { versionKey: false }
);

const Coproduct = mongoose.model("Coproduct", coproductSchema);

module.exports = Coproduct;
