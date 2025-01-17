const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "2586919a42ba7631845fda598861d479dbd787df8d749d727e88afc86cbcef3b";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak, token tidak tersedia." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid." });
  }
};

module.exports = { verifyToken };
