var express = require("express");
var router = express.Router();
const models = require("../models/index");
const master_kelas = require("../models/master_kelas");

router.post("/make_data", async (req, res, next) => {
  console.log(req.body);
  try {
    const { nama_kelas } = req.body;
    const make_data = await models.master_kelas.create({
      nama_kelas,
    });
    res.json(make_data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
