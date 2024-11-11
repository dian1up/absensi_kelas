"use strict";
const { request } = require("express");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.belongsTo(models.master_kelas, {
        foreignKey: "kelas_id",
        as: "kelas",
      });
    }
  }
  users.init(
    {
      role: {
        type: DataTypes.ENUM,
        values: ["guru", "ketua", "siswa"],
        allowNull: true,
      },
      nama: DataTypes.STRING,
      nisn: DataTypes.STRING,
      nip: DataTypes.STRING,
      password: DataTypes.STRING,
      kelas_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "master_kelas",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
