const mongoose = require("mongoose");

const RapportSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    note: {
      type: String,
    },
    objectif: {
      type: String,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        rotations: {
          type: Number,
        },
        availability: {
          type: Boolean,
          default: true,
        },
      },
    ],
    suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { versionKey: false }
);

const Rapport = mongoose.model("Rapport", RapportSchema);

module.exports = Rapport;
