var express = require("express");
var router = express.Router();
const models = require("../models/index");
const catatan = require("../models/catatan");
const KetuaKelasAuth = require("../middleware/KetuaKelasAuth");

router.post("/make_catatan", KetuaKelasAuth, async (req, res, next) => {
  console.log(req.body);
  try {
    const { isi_catatan, status } = req.body;
    const user_id = req.user_id;
    const make_catatan = await models.catatan.create({
      isi_catatan,
      user_id,
      status,
    });
    res.status(201).json({ data: make_catatan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/rekap_kelas", async (req, res, next) => {
  try {
    let rekap = await models.catatan.findAll({
      include: [
        {
          model: models.kelas,
          as: "kelas",
          attributes: ["nama_kelas"],
        },
      ],
    });
    return res.status(200).json({ responseCode: 200, data: rekap });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});
module.exports = router;
