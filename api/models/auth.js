"use strict";

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    "Auth",
    {
      id: {
        field: "auth_id",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      password: {
        field: "auth_password",
        type: DataTypes.TEXT,
        validate: {
          notEmpty: {
            msg: "El password no puede ir vacio",
          },
        },
      },
      createAt: {
        field: "auth_create_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("NOW()"),
      },
    },
    {
      underscored: true,
    }
  );

  Auth.prototype.generateHash = function (password) {
    return bcrypt.hash(password, bcrypt.genSaltSync(8));
  };
  Auth.prototype.validPassword = function (password, hash) {
    return bcrypt.compareSync(password, hash);
  };

  return Auth;
};
