const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Cam", "Supervisor", "Delegate"],
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    wilayas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wilaya",
      },
    ],
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
