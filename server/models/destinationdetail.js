"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DestinationDetail extends Model {
    static associate(models) {
      DestinationDetail.belongsTo(models.Destination, {
        foreignKey: "destinationId",
      });
    }
  }
  DestinationDetail.init(
    {
      destinationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Destination ID is required" },
          isInt: { msg: "Destination ID must be an integer" },
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[\d\s\-()+]+$/,
            msg: "Phone number must be valid",
          },
        },
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: { msg: "Website must be a valid URL" },
        },
      },
      opening_hours: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "Rating must be at least 0",
          },
          max: {
            args: [5],
            msg: "Rating must be at most 5",
          },
        },
      },
      total_reviews: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "Total reviews must be at least 0",
          },
          isInt: { msg: "Total reviews must be an integer" },
        },
      },
    },
    {
      sequelize,
      modelName: "DestinationDetail",
    }
  );
  return DestinationDetail;
};
