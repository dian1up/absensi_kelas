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
      // define association here
    }
  }
  attendance.init({
    user_id: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    clockin_date: DataTypes.DATE,
    clockin_latitude: DataTypes.FLOAT,
    clockin_longitude: DataTypes.FLOAT,
    clockout_date: DataTypes.DATE,
    clockout_latitude: DataTypes.FLOAT,
    clockout_longitude: DataTypes.FLOAT,
    is_leave: DataTypes.BOOLEAN,
    leave_note: DataTypes.STRING,
    attachment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'attendance',
  });
  return attendance;
};