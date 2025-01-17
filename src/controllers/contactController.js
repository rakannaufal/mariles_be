// BACKEND marilesBE: /src/controller/contactController.js

const { saveMessageFromDB } = require("../services/firebaseService");

const handleSubmitContact = async (req, res) => {
  const { user_id, name, email, message } = req.body;

  if (!user_id || !name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi.",
    });
  }

  try {
    const result = await saveMessageFromDB(user_id, name, email, message);
    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleSubmitContact,
};
