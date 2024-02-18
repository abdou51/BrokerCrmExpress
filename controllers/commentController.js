const Comment = require("../models/comment");
const User = require("../models/user");

const createComment = async (req, res) => {
  const supervisorId = req.user.userId;
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      supervisor: supervisorId,
    });

    const createdComment = await newComment.save();

    res.status(201).json(createdComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Comment" });
  }
};
const updateComment = async (req, res) => {
  const supervisorId = req.user.userId;

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.supervisor.toString() !== supervisorId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this comment" });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { comment: req.body.comment },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating comment" });
  }
};

const deleteComment = async (req, res) => {
  const supervisorId = req.user.userId;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.supervisor.toString() !== supervisorId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment" });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isDrafted: true },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting comment" });
  }
};
const getComments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    let comments;
    if (user.role === "Supervisor") {
      comments = await Comment.find({ supervisor: userId });
    } else if (user.role === "Admin") {
      comments = Comment.find();
    } else {
      comments = await Comment.find({ supervisor: user.createdBy });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting Comments" });
  }
};
module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComments,
};
