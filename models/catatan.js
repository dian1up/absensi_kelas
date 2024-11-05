'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class catatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  catatan.init({
    isi_catatan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'catatan',
  });
  return catatan;
};