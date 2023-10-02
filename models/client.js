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
    city: {
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
    phoneNumberOne: {
      type: Number,
    },
    phoneNumberTwo: {
      type: Number,
    },
  },
  { versionKey: false }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
