const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const todoSchema = mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  remark: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Done", "Ignored", "Cancelled"],
    default: "Pending",
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  delegate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

todoSchema.plugin(mongoosePaginate);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
