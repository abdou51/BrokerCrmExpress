const mongoose = require("mongoose");

const wilayaSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  zip: {
    type: Number,
  },
});

const Wilaya = mongoose.model("Wilaya", wilayaSchema);

module.exports = Wilaya;
