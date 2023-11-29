const mongoose = require("mongoose");

const wilayaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { versionKey: false }
);

const Wilaya = mongoose.model("Wilaya", wilayaSchema);

module.exports = Wilaya;
