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
    const token = jwt.sign(
      { userId: result.userData._id, email: result.userData.email },
      JWT_SECRET,
      {
        expiresIn: "1d", // Token berlaku selama 1 hari
      }
    );

    return res.status(200).json({
      success: true,
      token,
      userData: result.userData,
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
    const token = jwt.sign(
      { pengajarId: result.pengajarData._id, email: result.pengajarData.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      token,
      userData: result.pengajarData,
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

const getPengajarDataById = async (req, res) => {
  const { pengajarId } = req.params;
  const result = await getPengajarData(pengajarId);

  if (result.success) {
    return res.status(200).json({
      success: true,
      pengajarData: result.pengajarData,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};
const getPengajarDetails = async (req, res) => {
  const { pengajarId } = req.user; // Data dari token JWT

  try {
    const db = getDatabase();
    const pengajarRef = ref(db, `pengajar/${pengajarId}`);
    const snapshot = await get(pengajarRef);

    if (snapshot.exists()) {
      return res.status(200).json({
        success: true,
        data: snapshot.val(),
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Data pengajar tidak ditemukan.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data pengajar.",
    });
  }
};
module.exports = {
  handleLogin,
  handleRegister,
  handleLoginPengajar,
  handleRegisterPengajar,
  getPengajarDataById,
  getPengajarDetails,
};
