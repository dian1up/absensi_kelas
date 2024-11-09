'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class master_kelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  master_kelas.init({
    nama_kelas: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'master_kelas',
  });
  return master_kelas;
};