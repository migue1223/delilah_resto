"use strict";

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    "Auth",
    {
      auth_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      auth_password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El password no puede ir vacio",
          },
        },
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
