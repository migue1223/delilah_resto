"use strict";

const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        field: "prod_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        field: "prod_name",
        type: DataTypes.STRING(60),
        validate: {
          notEmpty: {
            msg: "Name cannot be empty",
          },
        },
        unique: {
          args: true,
          msg: "Product already registered",
        },
      },
      img: {
        field: "prod_img_url",
        type: DataTypes.TEXT,
      },
      price: {
        field: "prod_price",
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      enable: {
        field: "prod_enable",
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        field: "prod_create_at",
        type: DataTypes.DATE,
        defaultValue: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    },
    {
      underscored: true,
    }
  );
  return Product;
};
