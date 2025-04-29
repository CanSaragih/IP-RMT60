"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DestinationDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      destinationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Destinations",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      address: {
        type: Sequelize.TEXT,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      website: {
        type: Sequelize.STRING,
      },
      opening_hours: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.DECIMAL,
      },
      total_reviews: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DestinationDetails");
  },
};
