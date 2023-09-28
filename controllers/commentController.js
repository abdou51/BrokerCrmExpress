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

module.exports = {
  createComment,
};
