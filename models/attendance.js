'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      attendance.belongsTo(models.users, {
        foreignKey: "userId",
        as: "users",
      });
    }
  }
  attendance.init({
    userId: {type: DataTypes.INTEGER, references:{model:"users", key:"id"}},
    tanggal: DataTypes.DATE,
    clockin_date: DataTypes.DATE,
    clockin_latitude: DataTypes.DOUBLE,
    clockin_longitude: DataTypes.DOUBLE,
    clockout_date: DataTypes.DATE,
    clockout_latitude: DataTypes.DOUBLE,
    clockout_longitude: DataTypes.DOUBLE,
    is_leave: DataTypes.TINYINT,
    attachment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'attendance',
  });
  return attendance;
};