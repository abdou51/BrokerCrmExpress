const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const reference = new mongoose.Schema(
  {
    clientFullName: {
      type: String,
      required: true,
    },
    delegateFullName: {
      type: String,
      required: true,
    },
    clientSpeciality: {
      type: String,
      required: true,
    },
    clientWilaya: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const visitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
    command: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Command",
    },
    visitDate: {
      type: Date,
      required: [true, "visit Date is Required"],
    },
    state: {
      type: String,
      enum: ["Planned", "Done"],
      default: "Planned",
    },
    reference: reference,
  },
  { timestamps: true }
);
visitSchema.plugin(mongoosePaginate);
const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
