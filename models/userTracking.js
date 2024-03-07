const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userTrackingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
    },
    time: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  { timestamps: true }
);

userTrackingSchema.plugin(mongoosePaginate);

const UserTracking = mongoose.model("UserTracking", userTrackingSchema);

module.exports = UserTracking;
