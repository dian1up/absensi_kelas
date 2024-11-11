var express = require("express");
var router = express.Router();
const models = require("../models/index");
const jadwal_kelas = require("../models/jadwal_kelas");

router.post("/make_data", async (req, res, next) => {
  console.log(req.body);
  try {
    const { nama_pelajaran, materi, jam, kelas_id } = req.body;
    const make_data = await models.jadwal_kelas.create({
      nama_pelajaran,
      materi,
      jam,
      kelas_id,
    });
    res.json(make_data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/update_jadwal", async (req, res, next) => {
  const { id, nama_pelajaran, materi, hari, tanggal, jam, kelas_id } = req.body;
  try {
    const updatedJadwal = await models.jadwal_kelas.update(
      { nama_pelajaran, jam, materi, hari, tanggal, kelas_id },
      { where: { id } }
    );
    if (updatedJadwal[0] === 1) {
      const updatedData = await models.jadwal_kelas.findByPk(id);
      res.json(updatedData);
    } else {
      res.status(404).json({ error: "Jadwal not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/show_jadwal", async (req, res, next) => {
  try {
    let jadwal = await models.jadwal_kelas.findAll({
      include: [
        {
          model: models.master_kelas,
          as: "kelas",
          attributes: ["nama_kelas"],
        },
      ],
      attributes: ["id", "nama_pelajaran", "jam", "materi"],
    });

    return res.status(200).json({ responseCode: 200, data: jadwal });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});
router.delete("/delete_jadwal", async (req, res, next) => {
  const { id } = req.body;

  try {
    const deletedCount = await models.jadwal_kelas.destroy({
      where: { id },
    });
    if (deletedCount === 1) {
      res.json({ message: "Jadwal deleted successfully" });
    } else {
      res.status(404).json({ error: "Jadwal not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
