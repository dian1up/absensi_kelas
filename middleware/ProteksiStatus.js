const Attendance = require("../models/attendance");

const statusProtection = async (req, res, next) => {
  const { user_id, kelas_id } = req.user;
  const todayDate = new Date().toISOString().split("T")[0]; // Hanya tanggal, tanpa waktu

  try {
    // Cek apakah absensi aktif untuk kelas siswa
    const attendanceStatus = await Attendance.findOne({ where: { kelas_id, user_id } });
    
    // Jika absensi tidak aktif, kirimkan error
    if (!attendanceStatus || !attendanceStatus.isActive) {
      return res.status(403).json({ message: "Attendance is not active for your class." });
    }

    // Cek apakah siswa sudah absen hari ini dengan status tertentu
    const attendanceRecord = await Attendance.findOne({
      where: { user_id, kelas_id, date: todayDate },
    });

    // Jika sudah absen dengan status "Izin" atau "Tidak Hadir", kirimkan error
    if (attendanceRecord && (attendanceRecord.status === "Izin" || attendanceRecord.status === "Tidak Hadir")) {
      return res.status(403).json({ message: "You cannot check-in if you are absent or excused." });
    }

    // Jika semua validasi lolos, lanjutkan proses
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to verify attendance status.", error });
  }
};

module.exports = statusProtection;
