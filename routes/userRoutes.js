const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router
  .route("/login")
  .get(authController.isLoggedIn)
  .post(authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);

router
  .route("/me")
  .get(userController.getMe)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

router.post("/user", userController.getUser);

router
  .route("/friendreq")
  .get(userController.showRequests)
  .post(userController.sendFriendReq)
  .patch(userController.respondToFriendReq)
  .delete(userController.removeFriend);

router.post("/friends", userController.searchUsers);

router.post("/isFriend", userController.isFriend);
router.post("/isPending", userController.isPendingFriend);

router.get("/suggestedfriends", userController.showSuggestedFriends);

router.patch("/updatePassword", authController.updatePassword);

module.exports = router;
