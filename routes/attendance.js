// routes/attendance.js
var express = require("express");
var router = express.Router();
const  models = require('../models/index');
const attendance = require("../models/attendance");
const jwtverify = require("../middleware/authMiddlewareFix");
const FlagAllowed = require("../models/flag_allowed");
const KetuaKelasAuth = require ("../middleware/KetuaKelasAuth")
// const users  = require('../models/users');
const moment = require("moment");
const { Op, where } = require('sequelize');

// Endpoint untuk ketua kelas mengaktifkan absensi
router.post("/activate", jwtverify, KetuaKelasAuth, async (req, res) => {
  try {
    const { kelas_id, allowClockin, allowClockout } = req.body;
    const todayDate = moment().format("YYYY-MM-DD");

    // Update izin absensi di tabel flag_allowed berdasarkan kelas dan tanggal
    await FlagAllowed.upsert({
      kelas_id: kelas_id,
      date: todayDate,
      allow_clockin: allowClockin,
      allow_clockout: allowClockout,
    });

    res.status(200).json({ message: "Attendance status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update attendance status.", error });
  }
});


// Endpoint untuk clockin
router.post('/clockin', jwtverify, async (req, res) => {
    try {
        const { latitude, longitude, is_leave } = req.body;
        console.log(req.body);
  
        // Ensure userId is obtained from req, which is set by JWT middleware
        const user_Id = req.userId;
  
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is required for clock-in." });
        // }
  
        const attendanceStatus = is_leave ?? 1;
        const currentDate = new Date();
  
        const absen_masuk = await models.attendance.create({
            userId: user_Id, 
            tanggal: currentDate,
            clockin_date: currentDate,
            clockin_latitude: latitude,
            clockin_longitude: longitude,
            is_leave: attendanceStatus,
        });
  
        res.status(201).json({ message: "Clock-in successful", data: absen_masuk });
    } catch (error) {
        console.error("Clock-in error:", error);
        res.status(500).json({ message: "Server error during clock-in", error });
    }
  });
  

// Endpoint untuk clockout
router.post('/clockout', jwtverify, async (req, res) => {
  const { latitude, longitude, is_leave } = req.body;
  console.log(req.body);

  try {
      const today = new Date().toISOString().slice(0, 10);

      // Cari record absensi hari ini untuk user_id yang diberikan
      const attendanceRecord = await models.attendance.findOne({
          where: {
              userId: req.userId,
              tanggal: { [Op.startsWith]: today }
          }
      });

      // Jika tidak ada record absensi hari ini
      if (!attendanceRecord) {
          return res.status(404).json({ message: "No active clock-in record found for today." });
      }

      // Jika sudah melakukan clockout, tidak perlu clockout lagi
      if (attendanceRecord.clockout_date) {
          return res.status(403).json({ message: "You have already clocked out for today." });
      }

      // Update clockout_date dengan waktu sekarang dan informasi lokasi
      const currentDate = new Date().toISOString(); // Ambil waktu sekarang
      await attendanceRecord.update({
          clockout_date: currentDate,
          clockout_latitude: latitude,
          clockout_longitude: longitude,
          is_leave: is_leave ?? attendanceRecord.is_leave // Jaga nilai is_leave jika tidak diubah
      });

      res.status(200).json({
          message: "Clock-out has been successfully recorded.",
          attendance: attendanceRecord
      });
      
  } catch (error) {
      console.error("Clock-out error:", error);
      res.status(500).json({ message: "Server error during clock-out", error });
  }
});



router.get('/rekap_absensi', jwtverify, async (req, res) => {
    try {
      const kelas_id = req.kelas_id;
    // const tanggal = req.body;
  
      // // Validasi parameter
      // if (!kelas_id) {
      //   return res.status(400).json({ message: "kelas_id is required" });
      // }
  
      const checkoutRecords = await models.attendance.findAll({
        // where: {
        //   tanggal: tanggal,
        //   // clockout_date: { [Op.ne]: null }
        // },
        include: [
          {
            model: models.users, // Pastikan relasi attendance.belongsTo(users) sudah ada
            as: 'users',
            attributes: ['nama','kelas_id'], // Hanya ambil nama siswa
            where: { kelas_id: kelas_id }
          }
        ]
      });
  
      if (checkoutRecords.length === 0) {
        return res.status(404).json({ message: "No attendance records found" });
      }
  
      res.status(200).json({
        message: "Rekap pulang fetched successfully.",
        data: checkoutRecords
      });
    } catch (error) {
      console.error("Error fetching rekap pulang:", error);
      res.status(500).json({ message: "Failed to fetch rekap pulang", error });
    }
  });
  
  

module.exports = router;

