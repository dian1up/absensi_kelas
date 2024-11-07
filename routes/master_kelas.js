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
router.post("/update_kelas", async (req, res, next) => {
  const { id, nama_kelas } = req.body;
  try {
    const updatedKelas = await models.master_kelas.update(
      { nama_kelas },
      { where: { id } }
    );
    if (updatedKelas[0] === 1) {
      const updatedData = await models.master_kelas.findByPk(id);
      res.json(updatedData);
    } else {
      res.status(404).json({ error: "Kelas not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/delete_kelas", async (req, res, next) => {
  const { id } = req.body;
  try {
    const deletedCount = await models.master_kelas.destroy({
      where: { id },
    });

    if (deletedCount === 1) {
      res.json({ message: "kelas deleted successfully" });
    } else {
      res.status(404).json({ error: "kelas not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
