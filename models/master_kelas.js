"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class master_kelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      master_kelas.belongsTo(models.users, {
        foreignKey: "id_wali",
        as: "wali",
      });
    }
  }
  master_kelas.init(
    {
      nama_kelas: DataTypes.STRING,
      id_wali: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "master_kelas",
    }
  );
  return master_kelas;
};
