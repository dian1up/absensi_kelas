// routes/attendance.js
const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");
const jwtverify = require("../middleware/authMiddleware");

// Endpoint untuk ketua kelas mengaktifkan absensi
router.post("/activate", KetuaKelasAuth, authenticateToken, async (req, res) => {
  try {
    const { classId, isActive } = req.body;

    // Update status kelas menjadi aktif atau tidak aktif
    await Attendance.update({ isActive }, { where: { classId } });
    res.status(200).json({ message: "Attendance activated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to activate attendance.", error });
  }
});

// Endpoint untuk siswa melakukan absen
router.post("/insert", jwtverify, async (req, res) => {
    const { userId } = req.user;
    const { clockin_date, latitude, longitude, status } = req.body;
  
    try {
      const attendanceRecord = await Attendance.create({
        userId,
        date: new Date(),
        clockin_date,
        latitude,
        longitude,
        status,
      });
      res.status(201).json({ message: "Attendance recorded successfully.", attendanceRecord });
    } catch (error) {
      res.status(500).json({ message: "Failed to record attendance.", error });
    }
  });

module.exports = router;
