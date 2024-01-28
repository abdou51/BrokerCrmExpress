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
    coProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "coProduct",
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
    objectif: {
      type: String,
    },
    note: {
      type: String,
    },
    nearbyClients: [
      {
        fullName: {
          type: String,
        },
        remark: {
          type: String,
        },
        speciality: {
          type: String,
        },
        grade: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
