"use strict";

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        field: "order_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      created: {
        field: "order_create_time",
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("NOW()"),
        allowNull: false,
      },
      createdAt: {
        field: "order_create_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("NOW()"),
      },
    },
    {
      underscored: true,
    }
  );
  return Order;
};
