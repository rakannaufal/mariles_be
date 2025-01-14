// BACKEND marilesBE: /src/routes/forumRoutes.js
const express = require("express");
const {
  handleSubmit,
  getForumQuestions,
} = require("../controllers/forumController");
const router = express.Router();

router.post("/addForum", handleSubmit);
router.get("/", getForumQuestions); // Fixing the GET route

module.exports = router;
