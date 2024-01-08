const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    location: {
      type: String,
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
      },
    ],
    suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
