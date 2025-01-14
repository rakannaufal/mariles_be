// BACKEND marilesBE: /src/routes/authRoutes.js
const express = require("express");
const {
  handleLogin,
  handleRegister,
  handleLoginPengajar,
  handleRegisterPengajar,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/loginPengajar", handleLoginPengajar);
router.post("/registerPengajar", handleRegisterPengajar);

module.exports = router;
