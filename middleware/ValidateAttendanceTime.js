// middlewares/validateAttendanceTime.js
const FlagAllowed = require("../models/flag_allowed");
const moment = require("moment");

async function validateAttendanceTime(req, res, next) {
  const currentDate = moment().format('YYYY-MM-DD');

  try {
    const flagAllowed = await FlagAllowed.findOne({
      where: {
        date: currentDate,
        allow_clockin: true
      }
    });

    if (!flagAllowed) {
      return res.status(403).json({ message: "Absensi tidak diizinkan pada hari ini." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error validating attendance time.", error });
  }
}

module.exports = validateAttendanceTime;
