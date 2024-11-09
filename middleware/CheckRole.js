// middlewares/checkRole.js
function checkRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Akses ditolak. Hanya ketua kelas yang dapat mengakses fitur ini." });
      }
      next();
    };
  }
  
  module.exports = checkRole;
  