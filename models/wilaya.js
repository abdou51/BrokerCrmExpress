const mongoose = require("mongoose");

const wilayaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Wilaya name is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

const Wilaya = mongoose.model("Wilaya", wilayaSchema);

module.exports = Wilaya;
