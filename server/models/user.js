"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Trip, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email must be unique" },
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Must be a valid email address" },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Username is required" },
          notEmpty: { msg: "Username is required" },
        },
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "AvatarUrl is required" },
          notEmpty: { msg: "AvatarUrl is required" },
        },
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Provider is required" },
          notEmpty: { msg: "Provider is required" },
        },
      },
      providerId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Provider ID must be unique" },
        validate: {
          notNull: { msg: "Provider ID is required" },
          notEmpty: { msg: "Provider ID is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
