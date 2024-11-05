// middleware/classLeaderAuth.js
const jwt = require("jsonwebtoken");

const KetuaKelasAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Access denied." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    
    // Check if the user is a class leader
    if (user.role !== "class_leader") {
      return res.status(403).json({ message: "Only class leaders can activate attendance." });
    }

    req.user = user;
    next();
  });
};

module.exports = KetuaKelasAuth;
