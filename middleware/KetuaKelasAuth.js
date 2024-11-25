const jwt = require("jsonwebtoken");
function KetuaKelasAuth(req, res, next) {
  let token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    console.log(decoded);
    if (!["ketua", "guru"].includes(decoded.role)) {
      return res
        .status(403)
        .json({ error: "Access forbidden: role ketua or guru required" });
    }
    req.userId = decoded.userId;
    req.kelas = decoded.kelas;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ error: "Token is invalid or malformed" });
  }
}
module.exports = KetuaKelasAuth;
