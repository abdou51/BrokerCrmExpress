const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const todoSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "Please provide an Action"],
    },
    task: {
      type: String,
      required: [true, "Please provide a Task"],
    },
    region: {
      type: String,
      required: [true, "Please provide a Region"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a Start Date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an End Date"],
    },
    assignerRemark: {
      type: String,
    },
    targetRemark: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Done", "Ignored", "Cancelled"],
      default: "Pending",
    },
    assigner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an Assigner User id"],
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a target User id"],
    },
    cancelMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

todoSchema.plugin(mongoosePaginate);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
