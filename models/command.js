const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const commandSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    isHonored: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["Destockage", "Vente"],
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
      default: null,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    signature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    commandDate: {
      type: Date,
    },
  },
  { timestamps: true }
);
commandSchema.plugin(mongoosePaginate);
const Command = mongoose.model("Command", commandSchema);

module.exports = Command;
