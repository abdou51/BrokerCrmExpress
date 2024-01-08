const mongoose = require("mongoose");

const specialtySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isDrafted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

const Specialty = mongoose.model("Speciality", specialtySchema);

module.exports = Specialty;
