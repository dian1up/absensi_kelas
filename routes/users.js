var express = require("express");
var router = express.Router();
const models = require("../models/index");
const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwtverify = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const { Where } = require("sequelize/lib/utils");

/* Make data */
router.post("/make_data", async (req, res, next) => {
  console.log(req.body);
  try {
    const { role, nama, username, nisn, nip, password, kelas_id } = req.body;
    const hashedPaswword = await bcrypt.hash(password, 10);
    const make_data = await models.users.create({
      role: role || "siswa",
      nama,
      username,
      nisn,
      nip,
      password: hashedPaswword,
      kelas_id,
    });
    res
      .status(201)
      .json({ data: make_data, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await models.users.findOne({ where: { username } });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user.id }, "secret", { expireIn: "1y" });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});
router.get("/show_profile", jwtverify, async (req, res, next) => {
  try {
    let profile = await models.users.findOne({
      where: { id: req.userId },
      include: [
        {
          model: models.master_kelas,
          as: "kelas",
          attributes: ["nama_kelas"],
        },
      ],
      attributes: ["nama", "username", "nisn", "nip", "kelas_id"],
    });

    return res.status(200).json({ responseCode: 200, data: profile });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});
router.delete("/delete_accounts", jwtverify, async (req, res, next) => {
  try {
    const deletedCount = await models.users.destroy({
      where: { id: req.userId },
    });
    if (deletedCount === 1) {
      res.json({ message: "Accounts deleted successfully" });
    } else {
      res.status(404).json({ error: "Accounts not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
