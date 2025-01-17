// BACKEND marilesBE: /src/controller/forumController.js

const {
  saveForumQuestion,
  getForumQuestionsFromDB,
  getForumAnswersFromDB,
  saveForumAnswer,
  deleteForumQuestionFromDB,
} = require("../services/firebaseService");

const handleSubmit = async (req, res) => {
  const { user_id, username, tags, question } = req.body;

  if (!user_id || !username || !tags || !question) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi.",
    });
  }

  try {
    const result = await saveForumQuestion(user_id, username, tags, question);
    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const handleAnswer = async (req, res) => {
  const { forum_id, user_id, username, answer } = req.body;

  if (!forum_id || !user_id || !username || !answer) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi.",
    });
  }

  try {
    const result = await saveForumAnswer(forum_id, user_id, username, answer);
    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getForumQuestions = async (req, res) => {
  try {
    const questions = await getForumQuestionsFromDB();
    return res.status(200).json({ success: true, forum: questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getForumAnswers = async (req, res) => {
  const { forumId } = req.params;

  try {
    if (!forumId) {
      return res
        .status(400)
        .json({ success: false, message: "Forum ID is required." });
    }

    const answers = await getForumAnswersFromDB(forumId);
    if (!answers) {
      return res
        .status(404)
        .json({ success: false, message: "No answers found." });
    }

    return res.status(200).json({ success: true, answers });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }
};
const deleteForumQuestion = async (req, res) => {
  const { forumId } = req.params;
  const { user_id } = req.body; // Get the user_id from the request body

  if (!forumId || !user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Forum ID and User ID are required." });
  }

  try {
    const result = await deleteForumQuestionFromDB(forumId, user_id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleSubmit,
  handleAnswer,
  getForumQuestions,
  getForumAnswers,
  deleteForumQuestion,
};
