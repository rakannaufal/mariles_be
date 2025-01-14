// BACKEND marilesBE: /src/controllers/authController.js

const jwt = require("jsonwebtoken");
const {
  loginUser,
  registerUser,
  loginPengajar,
  registerPengajar,
} = require("../services/firebaseService");

const JWT_SECRET =
  "2586919a42ba7631845fda598861d479dbd787df8d749d727e88afc86cbcef3b"; // Ganti dengan kunci yang lebih aman

// Handle login user (pelajar)
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password tidak boleh kosong.",
    });
  }

  const result = await loginUser(email, password);
  if (result.success) {
    // Generate token JWT untuk user
    const token = jwt.sign(
      { userId: result.userData._id, email: result.userData.email },
      JWT_SECRET,
      {
        expiresIn: "1d", // Token berlaku selama 1 hari
      }
    );

    return res.status(200).json({
      success: true,
      token, // Kirimkan token ke frontend
      userData: result.userData, // Kirim data pengguna
    });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

// Handle login pengajar
const handleLoginPengajar = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password tidak boleh kosong.",
    });
  }

  const result = await loginPengajar(email, password);
  if (result.success) {
    // Generate token JWT untuk pengajar
    const token = jwt.sign(
      { userId: result.userData._id, email: result.userData.email },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token berlaku selama 1 jam
      }
    );

    return res.status(200).json({
      success: true,
      token, // Kirimkan token ke frontend
      username: result.username, // Kirim nama pengajar
    });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

// Handle registrasi user (pelajar)
const handleRegister = async (req, res) => {
  const { username, email, password, phone, address } = req.body;

  if (!username || !email || !password || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi.",
    });
  }

  const result = await registerUser(username, email, password, phone, address);
  if (result.success) {
    return res
      .status(200)
      .json({ success: true, message: "Registrasi berhasil." });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

// Handle registrasi pengajar
const handleRegisterPengajar = async (req, res) => {
  const { username, email, password, phone, address } = req.body;

  if (!username || !email || !password || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi.",
    });
  }

  const result = await registerPengajar(
    username,
    email,
    password,
    phone,
    address
  );
  if (result.success) {
    return res
      .status(200)
      .json({ success: true, message: "Registrasi berhasil." });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLoginPengajar,
  handleRegisterPengajar,
};
