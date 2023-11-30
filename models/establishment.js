const mongoose = require("mongoose");

const establishmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    wilaya: {
      type: String,
    },
    commune: {
      type: String,
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true, versionKey: false }
);

const Establishment = mongoose.model("Establishment", establishmentSchema);

module.exports = Establishment;
