"use strict";

module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "Status",
    {
      id: {
        field: "status_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        field: "status_name",
        type: DataTypes.STRING(60),
        unique: {
          args: true,
          msg: "Estado Ya Registrado",
        },
      },
      createdAt: {
        field: "status_create_at",
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal("NOW()"),
      },
    },
    {
      underscored: true,
    }
  );
  return Status;
};
