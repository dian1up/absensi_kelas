"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class jadwal_kelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      jadwal_kelas.belongsTo(models.master_kelas, {
        foreignKey: "kelas_id",
        as: "kelas",
      });
    }
  }
  jadwal_kelas.init(
    {
      nama_pelajaran: DataTypes.STRING,
      jam: DataTypes.TIME,
      hari: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      materi: DataTypes.STRING,
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
      modelName: "jadwal_kelas",
    }
  );
  return jadwal_kelas;
};
