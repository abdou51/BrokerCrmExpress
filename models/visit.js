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
    rapport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rapport",
    },
    visitLocation: {
      type: String,
    },
    visitDate: {
      type: String,
    },
    isDone: {
      type: Boolean,
      default: false,
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
