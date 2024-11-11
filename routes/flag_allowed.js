// routes/flagAllowed.js
const express = require("express");
const router = express.Router();
const FlagAllowed = require("../models/flag_allowed");

// Endpoint untuk memperbarui status buka (allow_clockin)
router.patch("/update_open", async (req, res) => {
  const { date, allow_clockin } = req.body;

  try {
    const flagRecord = await FlagAllowed.findOne({ where: { date } });

    if (!flagRecord) {
      return res.status(404).json({ message: "Flag for the specified date not found." });
    }

    await flagRecord.update({ allow_clockin });
    res.status(200).json({ message: "Clock-in status updated successfully.", flagRecord });
  } catch (error) {
    res.status(500).json({ message: "Failed to update clock-in status.", error });
  }
});

// Endpoint untuk memperbarui status tutup (allow_clockout)
router.patch("/update_close", async (req, res) => {
  const { date, allow_clockout } = req.body;

  try {
    const flagRecord = await FlagAllowed.findOne({ where: { date } });

    if (!flagRecord) {
      return res.status(404).json({ message: "Flag for the specified date not found." });
    }

    await flagRecord.update({ allow_clockout });
    res.status(200).json({ message: "Clock-out status updated successfully.", flagRecord });
  } catch (error) {
    res.status(500).json({ message: "Failed to update clock-out status.", error });
  }
});

module.exports = router;


