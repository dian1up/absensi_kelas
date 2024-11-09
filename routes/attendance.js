// routes/attendance.js
var express = require("express");
var router = express.Router();
const  models = require('../models/index');
const attendance = require("../models/attendance");
const jwtverify = require("../middleware/authMiddleware");
const FlagAllowed = require("../models/flag_allowed");
const KetuaKelasAuth = require ("../middleware/KetuaKelasAuth")
// const { User } = require('../models');
const moment = require("moment");
// const checkGeolocation = require("../middleware/geolocationMiddleware");
const { Op } = require('sequelize');

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

// Endpoint untuk siswa melakukan absen
// router.post("/absen", jwtverify, async (req, res) => {
//   const { userId } = req.user;
//   const { clockin_date, clockin_latitude, clockin_longitude, status } = req.body;
//   const todayDate = new Date().toISOString().split("T")[0]; // Hanya tanggal, tanpa waktu

//   try {
//     // Validasi status kehadiran
//     const validStatuses = ["Hadir", "Izin", "Sakit"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid attendance status." });
//     }

//     // Cek apakah sudah ada absensi hari ini untuk siswa ini
//     const existingRecord = await Attendance.findOne({
//       where: { user_id: userId, tanggal: todayDate },
//     });

//     if (existingRecord) {
//       return res.status(403).json({ message: "Attendance already recorded for today." });
//     }

//     // Simpan data absensi baru
//     const attendanceRecord = await Attendance.create({
//       user_id: userId,
//       tanggal: todayDate,
//       clockin_date,
//       clockin_latitude,
//       clockin_longitude,
//       status,
//     });

//     res.status(201).json({ message: "Attendance recorded successfully.", attendanceRecord });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to record attendance.", error });
//   }
// });

router.post('/clockin', async (req, res) => {
    console.log(req.body);
    try {
        const { user_id, status, latitude, longitude } = req.body;
        
        // Cek izin absen dari flag_allowed
        // const flag = await FlagAllowed.findOne({ where: { kelas_id: req.user.kelas_id, date: new Date() } });
        // if (!flag || !flag.allow_clockin) {
        //     return res.status(403).json({ message: "Clock-in not allowed" });
        // }

        // Simpan data absen
        const absen_masuk = await models.attendance.create({
            user_id,
            tanggal: new Date(),
            clockin_date: new Date(),
            clockin_latitude: latitude,
            clockin_longitude: longitude,
            status
        });

        res.status(201).json({ message: "Clock-in successful", data: attendance });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
});



router.post('/clockout', async (req, res) => {
    try {
        const { user_id, latitude, longitude, leave_note } = req.body;

        // Validasi jika `leave_note` diperlukan
        if (!leave_note) {
            return res.status(400).json({ message: "Leave note is required before clocking out" });
        }

        // Ambil tanggal hari ini (tanpa waktu)
        const today = new Date().toISOString().slice(0, 10); // Format: "YYYY-MM-DD"

        // Cari record absensi berdasarkan `user_id` dan `tanggal` (hanya tanggal tanpa waktu)
        const attendance = await models.attendance.findOne({ 
            where: { 
                user_id: user_id, 
                tanggal: {
                    [Op.like]: `${today}%`  // Menggunakan LIKE untuk mencocokkan tanggal saja
                }
            } 
        });

        if (!attendance) {
            return res.status(404).json({ message: "Clock-in record not found" });
        }

        // Update data clock-out dan leave note
        attendance.clockout_date = new Date();
        attendance.clockout_latitude = latitude;
        attendance.clockout_longitude = longitude;
        attendance.leave_note = leave_note;
        await attendance.save();

        res.status(200).json({ message: "Clock-out successful", attendance });
    } catch (error) {
        console.error(error); // Log error untuk debugging
        res.status(500).json({ message: "Server error", error });
    }
});





module.exports = router;
