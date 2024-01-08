const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
      enum: ["Planned", "Done", "Hold"],
      default: "Planned",
    },
  },
  { timestamps: true }
);
visitSchema.plugin(mongoosePaginate);
const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
