"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class hari extends Model {
    static associate(models) {
      // hari.belongsTo(models.jadwal_kelas, {
      //   foreignKey: "jadwal",
      //   as: "isijadwal",
      // });
    }
  }
  hari.init(
    {
      hari: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "hari",
    }
  );
  return hari;
};
