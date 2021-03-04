const multer = require("multer");
const sharp = require("sharp");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new AppError("Not an image", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPostPhoto = upload.single("photo");

exports.resizePostPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `post-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(2000, 2000)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`REACT_SIDE/public/imgs/posts/${req.file.filename}`);
  next();
};

exports.createPost = catchAsync(async (req, res, next) => {
  const finalObj = {
    body: req.body.body,
    author: req.user._id,
    date: new Date(),
  };
  if (req.file) finalObj.photo = `/imgs/posts/${req.file.filename}`;
  const newPost = await Post.create(finalObj);
  res.status(200).json({
    status: "success",
    data: newPost,
  });
});

exports.isPostMine = catchAsync(async (req, res, next) => {
  if (req.user._id.equals(req.body.id)) {
    res.json({
      mine: true,
    });
  } else {
    res.json({
      mine: false,
    });
  }
});

exports.deletePost = catchAsync(async (req, res, next) => {
  await Post.findByIdAndDelete(req.body.id);
  await Comment.deleteMany({ post: req.body.id });
  res.status(204).json({
    status: "success",
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("comments");
  res.json({
    status: "success",
    data: post,
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("friends");
  const friendsIds = user.friends.map((friend) => friend._id);
  const features = new ApiFeatures(
    Post.find({
      author: { $in: [req.user._id, ...friendsIds] },
    }).populate("comments"),
    req.query
  )
    .filter()
    .sort()
    .limitField()
    .pagination();
  const posts = await features.query;
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});

exports.isPostLiked = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.body.id);
  if (post.likes.some((like) => like.equals(req.user._id))) {
    res.json({ liked: true });
  } else {
    res.json({ liked: false });
  }
});

exports.likePost = catchAsync(async (req, res, next) => {
  console.log(req.body.id);
  const post = await Post.findById(req.body.id);
  if (!post.likes.some((like) => like.equals(req.user._id))) {
    post.likes.push(req.user._id);
    await post.save();
  }
  res.json({
    status: true,
  });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.body.id);
  if (post.likes.some((like) => like.equals(req.user._id))) {
    post.likes = post.likes.filter((like) => !like.equals(req.user._id));
    await post.save();
  }
  res.json({
    status: false,
  });
});

exports.comment = catchAsync(async (req, res, next) => {
  console.log(req.body, "yes");
  const comment = await Comment.create({
    post: req.body.post,
    author: req.user._id,
    body: req.body.body,
    date: new Date(),
  });
  res.json({
    status: "success",
    data: comment,
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Comment.find({ post: req.body.id }),
    req.query
  )
    .filter()
    .sort()
    .limitField()
    .pagination();
  const comments = await features.query;
  res.status(200).json({
    status: "success",
    results: comments.length,
    data: comments,
  });
});
