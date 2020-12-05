"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        field: "pay_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        field: "pay_name",
        type: DataTypes.STRING(60),
        unique: {
          args: true,
          msg: "Payment already registered",
        },
      },
      createdAt: {
        field: "pay_create_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("NOW()"),
      },
    },
    {
      underscored: true,
    }
  );
  return Payment;
};
