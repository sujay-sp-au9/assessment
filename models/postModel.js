const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Body is required"],
      minlength: 4,
      maxlength: 200,
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    date: {
      type: Date,
      required: [true, "Post must have a timestamp"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.pre(/^find/, function (next) {
  this.sort({ date: -1 });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
