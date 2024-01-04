const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    location: {
      type: String,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wilaya",
    },
    commune: {
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
      default: "A",
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
  { timestamps: true, versionKey: false }
);

clientSchema.plugin(mongoosePaginate);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
