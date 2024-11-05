'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jadwal_kelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jadwal_kelas.init({
    nama_pelajaran: DataTypes.STRING,
    jam: DataTypes.TIME,
    kelas_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'jadwal_kelas',
  });
  return jadwal_kelas;
};