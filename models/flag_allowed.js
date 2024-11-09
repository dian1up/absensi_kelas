'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class flag_allowed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // flag_allowed.belongsTo(models.master_kelas, {
      //   foreignKey: "kelas_id",
      //   as: "kelas",
      // });
      // define association here
    }
  }
  flag_allowed.init({
    date: DataTypes.DATE,
    allow_clockin: DataTypes.BOOLEAN,
    allow_clockout: DataTypes.BOOLEAN,
    kelas_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'flag_allowed',
  });
  return flag_allowed;
};