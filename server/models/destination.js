"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    static associate(models) {
      Destination.hasOne(models.DestinationDetail, {
        foreignKey: "destinationId",
      });
    }
  }
  Destination.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name cannot be empty" },
        },
      },
      googlePlaceId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
        validate: {
          isDecimal: { msg: "Latitude must be a decimal number" },
        },
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
        validate: {
          isDecimal: { msg: "Longitude must be a decimal number" },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: { msg: "Image URL must be a valid URL" },
        },
      },
    },
    {
      sequelize,
      modelName: "Destination",
    }
  );
  return Destination;
};
