const express = require("express");
const notesController = require("../controller/notesController");
const authController = require("../controller/authController");
const notesFolderController = require("../controller/notesFolderController");

const router = express.Router();

//* notes Folder

router
  .route("/create")
  .post(authController.isLoggedIn, notesFolderController.createNotesFolder);

router
  .route("/get")
  .get(authController.isLoggedIn, notesFolderController.getNotesFolder);

router
  .route("/getnotes/:id")
  .get(authController.isLoggedIn, notesFolderController.getNotesFromFolder);

router
  .route("/update/:id")
  .patch(authController.isLoggedIn, notesFolderController.updateFolder);

router
  .route("/delete/:id")
  .delete(authController.isLoggedIn, notesFolderController.deleteFolder);

module.exports = router;
