"use strict";

const Sequelize = require("sequelize");

const sequelize = new Sequelize("delilah_resto", "root", "root", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: "3308",
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
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.auth = require("../api/models/auth")(sequelize, Sequelize);
db.product = require("../api/models/product")(sequelize, Sequelize);
db.user = require("../api/models/user")(sequelize, Sequelize);

db.auth.belongsTo(db.user);
db.user.hasMany(db.auth);

module.exports = db;
