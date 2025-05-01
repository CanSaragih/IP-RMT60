"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const trips = require("../data/trip.json");
    const itineraries = require("../data/itineraries.json");
    const budgetItems = require("../data/budgetItems.json");
    const destinations = require("../data/destination.json");
    const detailDestinations = require("../data/destinationDetail.json");

    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        email: "dummy1@test.com",
        username: "Dummy One",
        provider: "google",
        providerId: "dummy-id-1",
        avatarUrl: "https://dummyavatar.com/1.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2, // yang dipakai di test (cocok dengan token JWT test)
        email: "dummy2@test.com",
        username: "Dummy Two",
        provider: "google",
        providerId: "dummy-id-2",
        avatarUrl: "https://dummyavatar.com/2.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert(
      "Trips",
      trips.map((trip) => {
        return {
          ...trip,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert(
      "Itineraries",
      itineraries.map((itinerary) => {
        return {
          ...itinerary,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert(
      "BudgetItems",
      budgetItems.map((budgetItem) => {
        return {
          ...budgetItem,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert(
      "Destinations",
      destinations.map((destination) => {
        return {
          ...destination,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert(
      "DestinationDetails",
      detailDestinations.map((detailDestination) => {
        return {
          ...detailDestination,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("DetailDestinations", null, {});
    await queryInterface.bulkDelete("Destinations", null, {});
    await queryInterface.bulkDelete("BudgetItems", null, {});
    await queryInterface.bulkDelete("Itineraries", null, {});
    await queryInterface.bulkDelete("Trips", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
