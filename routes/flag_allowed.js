// routes/flagAllowed.js
const express = require("express");
const router = express.Router();
const FlagAllowed = require("../models/flag_allowed");
const models = require("../models/index");
const jwtverify = require("../middleware/authMiddlewareFix");
const { Op, where } = require("sequelize");

// Endpoint untuk memperbarui status buka (allow_clockin)
router.post("/clokin_open", jwtverify, async (req, res) => {
  console.log(req.body);
  try {
    const { allow_clockin } = req.body;
    const kelas = req.kelas;
    const date = new Date();
    const flagAllowed = await models.flag_allowed.create({
      allow_clockin,
      kelas_id: kelas,
      date,
    });
    res.status(201).json({
      message: "Clock-in status updated successfully",
      data: flagAllowed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed clock-in status." });
  }
});

// Endpoint untuk memperbarui status tutup (allow_clockout)
router.post("/update_close", jwtverify, async (req, res) => {
  const { allow_clockout } = req.body;
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  try {
    const flagRecord = await models.flag_allowed.findOne({
      where: {
        kelas_id: req.kelas,
        date: { [Op.between]: [startOfDay, endOfDay] },
      },
    });

    if (!flagRecord) {
      return res
        .status(404)
        .json({ message: "Flag for the specified date not found." });
    }

    await flagRecord.update({ allow_clockout });
    res
      .status(200)
      .json({ message: "Clock-out status updated successfully.", flagRecord });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to update clock-out status.", error });
  }
});

module.exports = router;
