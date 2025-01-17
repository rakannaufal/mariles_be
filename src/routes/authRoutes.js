// BACKEND marilesBE: /src/routes/authRoutes.js
const express = require("express");
const {
  handleLogin,
  handleRegister,
  handleLoginPengajar,
  handleRegisterPengajar,
  getPengajarDetails,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/loginPengajar", handleLoginPengajar);
router.post("/registerPengajar", handleRegisterPengajar);

router.get("/pengajar/details", verifyToken, getPengajarDetails);
module.exports = router;
