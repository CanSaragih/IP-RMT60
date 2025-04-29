"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trip.init(
    {
      userId: DataTypes.INTEGER,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title cannot be empty" },
          notNull: { msg: "Title cannot be null" },
        },
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Start date is required" },
          isDate: { msg: "Start date must be a valid date" },
        },
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "End date is required" },
          isDate: { msg: "End date must be a valid date" },
          isAfterStart(value) {
            if (this.start_date && value < this.start_date) {
              throw new Error("End date must be after start date");
            }
          },
        },
      },
      total_budget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Total budget is required" },
          isInt: { msg: "Total budget must be an integer" },
          min: {
            args: [0],
            msg: "Total budget must be at least 0",
          },
        },
      },
      generated_plan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  return Trip;
};
