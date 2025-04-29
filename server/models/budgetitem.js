"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BudgetItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BudgetItem.init(
    {
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Trip ID is required" },
          isInt: { msg: "Trip ID must be an integer" },
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Category is required" },
          notEmpty: { msg: "Category cannot be empty" },
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Amount is required" },
          isInt: { msg: "Amount must be an integer" },
          min: {
            args: [0],
            msg: "Amount must be at least 0",
          },
        },
      },
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "BudgetItem",
    }
  );
  return BudgetItem;
};
