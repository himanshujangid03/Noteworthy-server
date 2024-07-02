const express = require("express");
const authController = require("../controller/authController");
const activityController = require("../controller/activityController");

const router = express.Router();

router
  .route("/create")
  .post(authController.isLoggedIn, activityController.createActivityLog);

router
  .route("/get")
  .get(authController.isLoggedIn, activityController.getActivityLog);

module.exports = router;
