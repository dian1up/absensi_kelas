// routes/flagAllowed.js
const express = require("express");
const router = express.Router();
const flag_allowed = require("../models/flag_allowed");
const models = require("../models/index");
const jwtverify = require("../middleware/authMiddlewareFix");

router.post("/update_open",jwtverify, async (req, res) => {
  const { allow_clockin } = req.body;

  try {
    const flagRecord = await models.flag_allowed.create({ 
      date: date, 
      allow_clockin: allow_clockin
    });

    if (!flagRecord) {
      return res.status(404).json({ message: "Flag for the specified date not created." });
    }

    res.status(200).json({ message: "Clock-in status added successfully.", flagRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add clock-in status.", error });
  }
});


// Endpoint untuk memperbarui status tutup (allow_clockout)
router.patch("/update_close", async (req, res) => {
  const { date, allow_clockout } = req.body;

  try {
    const flagRecord = await flag_allowed.findOne({ where: { date } });

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


