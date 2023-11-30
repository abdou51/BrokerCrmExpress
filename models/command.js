const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    isHonored: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
    },
    total: {
      type: Number,
      default: 0,
    },
    remise: {
      type: Number,
      default: 0,
    },
    totalRemised: {
      type: Number,
      default: 0,
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
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    motivations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Motivation",
      },
    ],
    suppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
    finalSupplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    invoice: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const Command = mongoose.model("Command", commandSchema);

module.exports = Command;
