const express = require("express");
const notesController = require("../controller/notesController");
const authController = require("../controller/authController");
const notesFolderController = require("../controller/notesFolderController");

const router = express.Router();

router
  .route("/getAll")
  .get(authController.isLoggedIn, notesController.getAllNotes);

router
  .route("/create")
  .post(authController.isLoggedIn, notesController.createNote);
router
  .route("/get/:id")
  .get(authController.isLoggedIn, notesController.getNote);

router
  .route("/update/:id")
  .patch(authController.isLoggedIn, notesController.updateNote);

router
  .route("/delete/:id")
  .delete(authController.isLoggedIn, notesController.deleteNote);

module.exports = router;
