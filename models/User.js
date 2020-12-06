"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        field: "user_username",
        type: DataTypes.STRING(60),
        validate: {
          notEmpty: {
            msg: "Username no puede ir vacio",
          },
        },
        unique: {
          args: true,
          msg: "Usuario o Email ya registrado",
        },
      },
      fullname: {
        field: "user_fullname",
        type: DataTypes.STRING(60),
        validate: {
          notEmpty: {
            msg: "El fullname no puede ir vacio",
          },
        },
      },
      email: {
        field: "user_email",
        type: DataTypes.STRING(60),
        validate: {
          isEmail: {
            msg: "Agrega un Correo Válido",
          },
          notEmpty: {
            msg: "El e-mail no puede ir vacio",
          },
        },
        unique: {
          args: true,
          msg: "Usuario o Email ya registrado",
        },
      },
      phone: {
        field: "user_phone",
        type: DataTypes.STRING(20),
        validate: {
          notEmpty: {
            msg: "Phone no puede ir vacio",
          },
        },
      },
      address: {
        field: "user_address",
        type: DataTypes.STRING(60),
        validate: {
          notEmpty: {
            msg: "Address no puede ir vacio",
          },
        },
      },
      admin: {
        field: "user_admin",
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      enable: {
        field: "user_enable",
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        field: "user_created_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("NOW()"),
      },
    },
    {
      underscored: true,
    }
  );
  return User;
};
