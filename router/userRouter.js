const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");

const router = express.Router();

router
  .route("/profile")
  .get(authController.isLoggedIn, authController.getUserName);

router
  .route("/update-user")
  .patch(authController.isLoggedIn, userController.updateUser);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
router.route("/logout").post(authController.logout);
router
  .route("/delete-user")
  .delete(authController.isLoggedIn, userController.deleteUser);

module.exports = router;
