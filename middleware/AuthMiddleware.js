const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi token JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Mengambil token dari header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'yourSecretKey'; // Pastikan gunakan secret key yang benar
        const decoded = jwt.verify(token, secretKey); // Verifikasi token

        // Simpan data user yang ter-decode dari token ke dalam request
        req.user = decoded;
        next(); // Lanjut ke middleware berikutnya
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;