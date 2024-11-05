var express = require("express");
var router = express.Router();
const models = require("../models/index");
const jadwal_kelas = require("../models/jadwal_kelas");

router.post("/make_data", async (req, res, next) => {
  console.log(req.body);
  try {
    const { nama_pelajaran, jam, kelas_id } = req.body;
    const make_data = await models.jadwal_kelas.create({
      nama_pelajaran,
      jam,
      kelas_id,
    });
    res.json(make_data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
