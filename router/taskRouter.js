const express = require("express");

const authController = require("../controller/authController");
const taskController = require("../controller/taskController");

const router = express.Router();

router
  .route("/create")
  .post(authController.isLoggedIn, taskController.createTask);

router.route("/get").get(authController.isLoggedIn, taskController.getTask);

router
  .route("/update/:id")
  .patch(authController.isLoggedIn, taskController.updateTask);

router
  .route("/delete/:id")
  .delete(authController.isLoggedIn, taskController.deleteTask);

router
  .route("/forgot-password")
  .post(authController.isLoggedIn, authController.forgotPassword);

module.exports = router;
