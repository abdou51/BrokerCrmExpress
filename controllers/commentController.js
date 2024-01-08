const Comment = require("../models/comment");

const createComment = async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
    });

    const createdComment = await newComment.save();

    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ error: "Error creating Comment" });
    console.error(error);
  }
};
const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        comment: req.body.comment,
      },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Error updating Comment" });
    console.error(error);
  }
};
const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(500).json({ error: "Error deleting Comment" });
    console.error(error);
  }
};
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error getting Comments" });
    console.error(error);
  }
};
module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComments,
};
