const jwt = require("jsonwebtoken");
const KetuaKelasAuth = (req, res, next) => {
  const token = req.headers["Authorization"];
  if (!token) {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const decoded = jwt.verify(token, "secret");
    if ((decoded.role !== "ketua", "siswa")) {
      return res
        .status(403)
        .json({ error: "Access forbidden: role ketua required" });
    }
    req.kelas_id = decoded.kelas_id;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ error: "Token is invalid or malformed" });
  }
};
module.exports = KetuaKelasAuth;
