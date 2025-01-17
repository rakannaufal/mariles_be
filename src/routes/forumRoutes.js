// BACKEND marilesBE: /src/routes/forumRoutes.js
const express = require("express");
const {
  handleSubmit,
  getForumQuestions,
  handleAnswer,
  getForumAnswers,
  deleteForumQuestion,
} = require("../controllers/forumController");
const router = express.Router();

router.post("/addForum", handleSubmit);
router.post("/addAnswer", handleAnswer);
router.get("/", getForumQuestions); // Fixing the GET route
router.get("/answers/:forumId", getForumAnswers);
router.delete("/deleteForum/:forumId", deleteForumQuestion);

module.exports = router;
