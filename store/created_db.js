"use-strict";
require("dotenv").config();

const mysql = require("mysql");

const dbconf = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  port: process.env.MYSQL_PORT,
};

let connection;

function handleCon() {
  connection = mysql.createConnection(dbconf);

  connection.connect((err) => {
    if (err) {
      console.error("[db err]", err);
      setTimeout(handleCon, 2000);
    } else {
      console.log("DB Connected!");
    }
  });
}

handleCon();

async function createdDatabase() {
  return new Promise((resolve, reject) => {
    connection.query(
      "CREATE DATABASE IF NOT EXISTS delilah_resto",
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

async function createdTableOrders() {
  return new Promise((resolve, reject) => {
    connection.query(
      "CREATE TABLE IF NOT EXISTS `orders` (`order_id` INTEGER NOT NULL auto_increment , `order_create_time` DATETIME NOT NULL DEFAULT NOW(), `order_create_at` DATETIME DEFAULT NOW(), `user_id` INTEGER, `status_id` INTEGER, `payment_id` INTEGER, PRIMARY KEY (`order_id`), FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`) ON DELETE SET NULL ON UPDATE CASCADE, FOREIGN KEY (`payment_id`) REFERENCES `payments` (`pay_id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB, SHOW INDEX FROM `orders`",
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
        connection.end();
      }
    );
  });
}

createdDatabase().then(() => createdTableOrders());
