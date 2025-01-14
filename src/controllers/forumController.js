// BACKEND marilesBE: /src/controller/forumController.js

const {
  saveForumQuestion,
  getForumQuestionsFromDB,
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

const getForumQuestions = async (req, res) => {
  try {
    const questions = await getForumQuestionsFromDB();
    return res.status(200).json({ success: true, forum: questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleSubmit,
  getForumQuestions,
};
