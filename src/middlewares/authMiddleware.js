const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "IVvh6WHrR4opGMF6MAgxtaIebwy5F7AhS2AkyUT4BjzOHRg0OI3CpF1y9axuTOUdl9JG2wbTzSvLK9JE66LC3g=="; // Ganti dengan kunci yang aman

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Token tidak ada." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid." });
  }
};

module.exports = { verifyToken };
