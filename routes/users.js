var express = require("express");
var router = express.Router();
const models = require("../models/index");
const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwtverify = require("../middleware/authMiddleware");
const { Where } = require("sequelize/lib/utils");

/* Make data */
router.post("/make_data", async (req, res, next) => {
  console.log(req.body);
  try {
    const { role, nama, nisn, nip, password, kelas_id } = req.body;
    const Roles = ["guru", "siswa", "siswa"];
    if (!Roles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const hashedPaswword = await bcrypt.hash(password, 10);
    const make_data = await models.users.create({
      role,
      nama,
      nisn,
      nip,
      password,
      kelas_id,
    });
    res.json(make_data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { nama, password } = req.body;
    const user = await models.users.findOne({ where: { nama } });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ userId: user.id }, "secret");
    res.json({ token });
  } catch (error) {}
});
router.get("/show_profile", jwtverify, async (req, res, next) => {
  try {
    let profile = await models.users.findOne({
      where: { id: req.userId },
      attributes: ["nama", "nisn", "nip", "kelas_id"],
    });
    return res.status(200).json({
      responseCode: 200,
      data: profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});

module.exports = router;
