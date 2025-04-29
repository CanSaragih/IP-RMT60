"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DestinationDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      phoneNumber: {
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
      openingHours: {
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
      totalReviews: {
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
