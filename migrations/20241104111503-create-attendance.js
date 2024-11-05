'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
      user_id: {
        type: Sequelize.INTEGER
      },
      tanggal: {
        type: Sequelize.DATE
      },
      clockin_date: {
        type: Sequelize.DATE
      },
      clockin_latitude: {
        type: Sequelize.FLOAT
      },
      clockin_longitude: {
        type: Sequelize.FLOAT
      },
      clockout_date: {
        type: Sequelize.DATE
      },
      clockout_latitude: {
        type: Sequelize.FLOAT
      },
      clockout_longitude: {
        type: Sequelize.FLOAT
      },
      is_leave: {
        type: Sequelize.BOOLEAN
      },
      leave_note: {
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendances');
  }
};