const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  wilayas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wilaya" }],
  portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
