const mongoose = require("mongoose");

const motivationSchema = new mongoose.Schema(
  {
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
  { timestamps: true }
);

const Motivation = mongoose.model("Motivation", motivationSchema);

module.exports = Motivation;
