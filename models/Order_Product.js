"use strict";

const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Order_Product = sequelize.define(
    "Order_Product",
    {
      id: {
        field: "op_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      created: {
        field: "op_create_time",
        type: DataTypes.DATE,
        defaultValue: moment().format("YYYY-MM-DD HH:mm:ss"),
        allowNull: false,
      },
      quantity: {
        field: "op_quantity",
        type: DataTypes.INTEGER,
      },
      price: {
        field: "op_price",
        type: DataTypes.FLOAT,
      },
      createdAt: {
        field: "order_create_at",
        type: DataTypes.DATE,
        defaultValue: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    },
    {
      underscored: true,
    }
  );
  return Order_Product;
};
