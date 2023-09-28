const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
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
  { versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
