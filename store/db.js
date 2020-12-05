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

db.auth = require("../models/Auth")(sequelize, Sequelize);
db.order = require("../models/Order")(sequelize, Sequelize);
db.order_product = require("../models/Order_Product")(sequelize, Sequelize);
db.payment = require("../models/Payment")(sequelize, Sequelize);
db.product = require("../models/Product")(sequelize, Sequelize);
db.status = require("../models/Status")(sequelize, Sequelize);
db.user = require("../models/User")(sequelize, Sequelize);

db.auth.belongsTo(db.user);
db.user.hasMany(db.auth);

db.order.belongsTo(db.user);
db.user.hasMany(db.order);

db.order.belongsTo(db.status);
db.status.hasMany(db.order);

db.order.belongsTo(db.payment);
db.payment.hasMany(db.order);

db.order_product.belongsTo(db.user);
db.user.hasMany(db.order_product);

db.order_product.belongsTo(db.order);
db.order.hasMany(db.order_product);

db.order_product.belongsTo(db.product);
db.product.hasMany(db.order_product);

module.exports = db;
