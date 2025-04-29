"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itinerary extends Model {
    static associate(models) {
      Itinerary.belongsTo(models.Trip, { foreignKey: "tripId" });
    }
  }
  Itinerary.init(
    {
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Trip ID is required" },
          isInt: { msg: "Trip ID must be an integer" },
        },
      },
      dayNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Day number is required" },
          isInt: { msg: "Day number must be an integer" },
          min: {
            args: [1],
            msg: "Day number must be at least 1",
          },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location is required" },
          notEmpty: { msg: "Location cannot be empty" },
        },
      },
      activity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Activity is required" },
          notEmpty: { msg: "Activity cannot be empty" },
        },
      },
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Itinerary",
    }
  );
  return Itinerary;
};
