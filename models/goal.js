const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
