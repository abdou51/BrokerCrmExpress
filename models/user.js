const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Kam", "Supervisor", "Delegate", "Operator"],
      required: true,
    },
    type: {
      type: String,
      enum: ["M", "C", "MC"],
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
    phonePersonal: {
      type: String,
    },
    phoneProfessional: {
      type: String,
    },
    address: {
      type: String,
    },
    wilaya: {
      type: String,
    },
    commune: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.username) {
    this.username = this.username.toLowerCase();
  }
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
