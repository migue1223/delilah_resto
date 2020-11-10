"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("Users", {
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    users_username: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username no puede ir vacio",
        },
      },
      unique: {
        args: true,
        msg: "Usuario Ya Registrado",
      },
    },
    users_fullname: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El fullname no puede ir vacio",
        },
      },
    },
    users_email: {
      type: DataTypes.STRING(60),
      allowNull: false,
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
        msg: "Email Ya Registrado",
      },
    },
    users_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone no puede ir vacio",
        },
      },
    },
    users_address: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address no puede ir vacio",
        },
      },
    },
    users_admin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    users_enable: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    underscored: true
  });
  return User;
};
