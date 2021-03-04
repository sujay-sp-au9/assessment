const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/delete")
  .post(postController.isPostMine)
  .patch(postController.deletePost);

router
  .route("/comment")
  .post(postController.getAllComments)
  .patch(postController.comment);

router.post("/liked", postController.isPostLiked);

router
  .route("/likeUnlike")
  .post(postController.likePost)
  .patch(postController.unlikePost);

router
  .route("/")
  .get(postController.getPosts)
  .post(
    postController.uploadPostPhoto,
    postController.resizePostPhoto,
    postController.createPost
  );

module.exports = router;
