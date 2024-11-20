const jwt = require("jsonwebtoken");
function jwtverify(req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    console.log("Decoded JWT Payload:", decoded); // Pastikan userId ada di sini
    if (!decoded.kelas_id) {
      return res.status(400).json({ error: "kelas_id is missing from the token" });
    }
    req.userId = decoded.userId;
    req.kelas = decoded.kelas;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = jwtverify;
