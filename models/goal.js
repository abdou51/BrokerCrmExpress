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
    goalDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
