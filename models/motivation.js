const mongoose = require("mongoose");

const motivationSchema = new mongoose.Schema(
  {
    motivation: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Motivation = mongoose.model("Motivation", motivationSchema);

module.exports = Motivation;
