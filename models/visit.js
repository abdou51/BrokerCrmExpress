const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const visitSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    visitLocation: {
      type: String,
    },
    createdDate: {
      type: String,
    },
  },
  { versionKey: false }
);
visitSchema.plugin(mongoosePaginate);
const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
