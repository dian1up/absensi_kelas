"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class catatan extends Model {
    static associate(models) {
      catatan.belongsTo(models.master_kelas, {
        foreignKey: "kelas_id",
        as: "kelas",
      });
      catatan.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }
  catatan.init(
    {
      isi_catatan: DataTypes.TEXT,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      kelas_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "master_kelas",
          key: "id",
        },
      },
      tanggal: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "catatan",
    }
  );
  return catatan;
};
