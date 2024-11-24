var express = require("express");
var router = express.Router();
const models = require("../models/index");
const catatan = require("../models/catatan");
const KetuaKelasAuth = require("../middleware/KetuaKelasAuth");
const jwtverify = require("../middleware/authMiddlewareFix");

router.post("/make_catatan", KetuaKelasAuth, async (req, res, next) => {
  console.log(req.body);
  try {
    const { isi_catatan } = req.body;
    const user_id = req.userId;
    const kelas = req.kelas;
    const tanggal = new Date();
    const make_catatan = await models.catatan.create({
      isi_catatan,
      user_id: user_id,
      kelas_id: kelas,
      tanggal,
    });
    res.status(201).json({ data: make_catatan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/info_catatan", jwtverify, async (req, res, next) => {
  try {
    const user_id = req.userId;
    const kelas_id = req.kelas;
    let info = await models.attendance.findOne({
      where: { userId: user_id },
      include: [{ model: models.users, as: "users", attributes: ["nama"] }],
      attributes: ["is_leave"],
    });

    const kelas = await models.master_kelas.findOne({
      where: { id: kelas_id },
      attributes: ["nama_kelas"],
    });
    let statusText = "";
    switch (info.is_leave) {
      case 1:
        statusText = "masuk";
        break;
      case 2:
        statusText = "ijin";
        break;
      case 3:
        statusText = "sakit";
        break;
      default:
        statusText = "tidak diketahui";
    }
    const infoData = {
      nama: info.users.nama,
      status: statusText,
      kelas: kelas.nama_kelas,
    };
    return res.status(200).json({ responseCode: 200, data: infoData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});
module.exports = router;
