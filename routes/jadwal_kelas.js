var express = require("express");
var router = express.Router();
const models = require("../models/index");
const jadwal_kelas = require("../models/jadwal_kelas");
const hari = require("../models/hari");
const { where } = require("sequelize");
const jwtverify = require("../middleware/authMiddlewareFix");

router.post("/make_data", async (req, res, next) => {
  console.log(req.body);
  try {
    const { nama_pelajaran, hari, materi, jam, kelas_id } = req.body;
    const make_data = await models.jadwal_kelas.create({
      nama_pelajaran,
      materi,
      jam,
      hari,
      kelas_id,
    });
    res.json(make_data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/make_hari", async (req, res, next) => {
  console.log(req.body);
  try {
    const { hari, jadwal } = req.body;
    const make_data = await models.hari.create({
      hari,
      jadwal,
    });
    res.json(make_data);
  } catch (error) {
    console.log(error);
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
router.get("/show_jadwal", jwtverify, async (req, res, next) => {
  try {
    const kelasId = req.kelas;
    let jadwal = await models.jadwal_kelas.findAll({
      include: [
        {
          model: models.hari,
          as: "hariDetails",
          attributes: ["hari"],
        },
        {
          model: models.master_kelas,
          as: "kelas",
          attributes: ["nama_kelas"],
        },
      ],
      where: { kelas_id: kelasId },
      attributes: [
        "nama_pelajaran",
        "jam",
        "materi",
        "jam_selesai",
        "kelas_id",
      ],
    });
    const mappedData = jadwal.reduce((acc, item) => {
      const hari = item.hariDetails.hari;
      const jadwalItem = {
        nama_pelajaran: item.nama_pelajaran,
        jam: item.jam,
        jam_selesai: item.jam_selesai,
        materi: item.materi,
        kelas: item.kelas ? item.kelas.nama_kelas : null,
      };

      if (acc[hari]) {
        acc[hari].push(jadwalItem);
      } else {
        acc[hari] = [jadwalItem];
      }
      return acc;
    }, {});

    const result = Object.keys(mappedData).map((hari) => ({
      hari,
      jadwal: mappedData[hari],
    }));

    return res.status(200).json({ responseCode: 200, data: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});

// router.get("/show_jadwal", jwtverify, async (req, res, next) => {
//   try {
//     const kelasId = req.kelas;
//     let jadwal = await models.hari.findAll({
//       include: [
//         {
//           model: models.jadwal_kelas,
//           as: "isijadwal",
//           attributes: [
//             "nama_pelajaran",
//             "jam",
//             "materi",
//             "kelas_id",
//             "jam_selesai",
//           ],
//           where: { kelas_id: kelasId },
//         },
//       ],
//       attributes: ["hari", "jadwal"],
//     });

//     return res.status(200).json({ responseCode: 200, data: jadwal });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ responseCode: 400, message: error.message });
//   }
// });
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
