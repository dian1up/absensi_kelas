"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      role: {
        type: DataTypes.ENUM,
        values: ["guru", "siswa", "siswa"],
        allowNull: true,
      },
      nama: DataTypes.STRING,
      nisn: DataTypes.STRING,
      nip: DataTypes.STRING,
      password: DataTypes.STRING,
      kelas_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
