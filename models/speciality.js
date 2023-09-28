const mongoose = require("mongoose");

const specialtySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

const Specialty = mongoose.model("Speciality", specialtySchema);

module.exports = Specialty;
