const mongoose = require("mongoose");

const motivationSchema = new mongoose.Schema(
  {
    motivation: {
      type: String,
      required: true,
    },
    isDrafted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { versionKey: false }
);

const Motivation = mongoose.model("Motivation", motivationSchema);

module.exports = Motivation;
