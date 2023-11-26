const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    establishments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Establishment" },
    ],
  },
  { versionKey: false }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
