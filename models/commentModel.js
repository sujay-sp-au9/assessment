const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: [true, "Comment must belong to a post"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Comment must belong to a user"],
  },
  body: {
    type: String,
    required: [true, "Body is required"],
    minlength: 4,
    maxlength: 100,
  },
  date: {
    type: Date,
    required: [true, "Comment must have a timestamp"],
  },
});

commentSchema.pre(/^find/, function (next) {
  this.sort({ date: -1 });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
