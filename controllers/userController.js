const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.json({ status: "success", data: user });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.id);
  res.json({ status: "success", data: user });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new AppError("Not an image", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });
  return newObj;
};

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(700, 1000)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`REACT_SIDE/public/imgs/users/${req.file.filename}`);
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword",
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, "email");
  if (req.file) filteredBody.photo = `/imgs/users/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.searchUsers = catchAsync(async (req, res, next) => {
  let re = new RegExp("^" + req.body.input, "ig");
  let users = await User.find({ name: re })
    .populate("friends")
    .populate("pendingFriends");
  users = users.filter((user) => !user._id.equals(req.user._id));
  res.json({
    status: "success",
    data: users,
  });
});

exports.sendFriendReq = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.pendingFriends = [...user.pendingFriends, req.body.id];
  await user.save({ validateBeforeSave: false });
  const friendToBe = await User.findById(req.body.id);
  friendToBe.pendingFriends.push(req.user._id);
  friendToBe.requests.push(req.user._id);
  await friendToBe.save({ validateBeforeSave: false });
  res.json({ status: "success" });
});

exports.respondToFriendReq = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findById(req.user._id);
  user.requests = user.requests.filter((request) => {
    request.equals(req.body.id);
  });
  user.pendingFriends = user.pendingFriends.filter((pendingFriend) => {
    pendingFriend.equals(req.body.id);
  });
  if (req.body.accepted) {
    user.friends.push(req.body.id);
  }
  await user.save({ validateBeforeSave: false });
  const friendTobe = await User.findById(req.body.id);
  friendTobe.pendingFriends = friendTobe.pendingFriends.filter(
    (pendingFriend) => {
      pendingFriend.equals(req.user._id);
    }
  );
  if (req.body.accepted) {
    friendTobe.friends.push(req.user._id);
  }
  await friendTobe.save({ validateBeforeSave: false });
  res.json({ status: "success" });
});

exports.isFriend = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("friends")
    .select("friends");
  const friendToCheckWith = await User.findById(req.body.id).select("_id");
  res.json({
    status: user.friends.some((friend) =>
      friend._id.equals(friendToCheckWith._id)
    ),
  });
});

exports.isPendingFriend = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("pendingFriends")
    .select("pendingFriends");
  const friendToCheckWith = await User.findById(req.body.id).select("_id");
  res.json({
    status: user.pendingFriends.some((friend) =>
      friend._id.equals(friendToCheckWith._id)
    ),
  });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("friends")
    .select("friends");
  user.friends = user.friends.filter(
    (friend) => !friend._id.equals(req.body.id)
  );
  const userFriendToRemove = await User.findById(req.body.id)
    .populate("friends")
    .select("friends");
  userFriendToRemove.friends = userFriendToRemove.friends.filter(
    (friend) => !friend._id.equals(req.user._id)
  );
  await user.save({ validateBeforeSave: false });
  await userFriendToRemove.save({ validateBeforeSave: false });
  res.json({ status: "success" });
});

exports.showSuggestedFriends = catchAsync(async (req, res, next) => {
  let suggestedFriends = [];
  const user = await User.findById(req.user._id)
    .populate("friends")
    .populate("pendingFriends");
  user.friends.forEach(async (friend) => {
    const userFriend = await User.findById(friend._id).populate("friends");
    userFriend.friends.forEach((friendOfFriend) => {
      if (
        !(
          user.friends.some((friend) =>
            friend._id.equals(friendOfFriend._id)
          ) ||
          user.pendingFriends.some((pendingFriend) =>
            pendingFriend._id.equals(friendOfFriend._id)
          ) ||
          friendOfFriend._id.equals(user._id)
        )
      ) {
        suggestedFriends.push(friendOfFriend);
      }
    });
  });
  setTimeout(() => {
    res.json({
      status: "success",
      data: suggestedFriends,
    });
  }, 2000);
});

exports.showRequests = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("requests")
    .select("requests");
  res.json({
    status: "success",
    data: user.requests,
  });
});
