const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { utcToZonedTime } = require("date-fns-tz");

function getCurrentDateInAlgeria() {
  const timeZone = "Africa/Algiers";
  const now = new Date();
  const dateInAlgeria = utcToZonedTime(now, timeZone);
  return dateInAlgeria;
}
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
    visitLocation: {
      type: String,
    },
    visitDate: {
      type: Date,
      default: getCurrentDateInAlgeria(),
    },
    state: {
      type: String,
      enum: ["Planned", "Done", "Hold"],
      default: "Planned",
    },
    hasCommand: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);
visitSchema.plugin(mongoosePaginate);
const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
