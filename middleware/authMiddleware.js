const jwt = require("jsonwebtoken");
function jwtverify(req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, "rahasia");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = jwtverify;
