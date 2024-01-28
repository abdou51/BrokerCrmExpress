const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    isDrafted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
