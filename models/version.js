const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    obligatory: {
      type: Boolean,
      required: true,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Version = mongoose.model("Version", versionSchema);

module.exports = Version;
