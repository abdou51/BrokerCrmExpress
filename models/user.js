const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "CAM", "Supervisor", "Delegate"],
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    wilayas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wilaya" }],
    portfolio: [
      {
        client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
