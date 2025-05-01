"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Trips", "photoReference", Sequelize.TEXT);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Trips", "photoReference");
  },
};
