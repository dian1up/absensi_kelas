"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class catatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      catatan.belongsTo(models.master_kelas, {
        foreignKey: "kelas_id",
        as: "kelas",
      });
    }
  }
  catatan.init(
    {
      isi_catatan: DataTypes.TEXT,
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
      modelName: "catatan",
    }
  );
  return catatan;
};
