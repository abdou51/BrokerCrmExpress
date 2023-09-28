const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    localization: {
      type: String,
    },
    firstName: {
      type: String,
    },
    domainType: {
      type: String,
      enum: ["doctor", "pharmacy", "wholesaler"],
      required: true,
    },
    wilaya: {
      type: String,
    },
    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speciality",
    },
    commun: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    totalSellers: {
      type: Number,
    },
    totalPostChifa: {
      type: Number,
    },
    clientPresence: {
      type: String,
    },
    totalOperators: {
      type: Number,
    },
    potential: {
      type: String,
      enum: ["A", "B", "C"],
    },
    email: {
      type: String,
    },
  },
  { versionKey: false }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
