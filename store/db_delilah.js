"use strict";

const config = require("../config/");
const Sequelize = require("sequelize");

const db = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: "mysql",
    charset: "utf8",
    collate: "utf8_general_ci",
    loggin: true,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+05:30",
    define: {
      timestamps: false,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = {db};
