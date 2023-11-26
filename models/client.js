const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    location: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Doctor", "Pharmacy", "Wholesaler"],
      required: true,
    },
    sector: {
      type: String,
      enum: ["Private", "State"],
    },
    grade: {
      type: String,
    },
    wilaya: {
      type: String,
    },
    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speciality",
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
    phoneNumberOne: {
      type: String,
    },
    phoneNumberTwo: {
      type: String,
    },
  },
  { versionKey: false }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
