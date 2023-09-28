const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const taskSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitDate: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);
taskSchema.plugin(mongoosePaginate);
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
