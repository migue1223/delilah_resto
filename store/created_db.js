"use-strict";
require("dotenv").config();

const db = require("./db");
const mysql = require("mysql");
const config = require("../config/");

const dbconf = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  port: config.mysql.port,
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

createdDatabase().then(() => {
  db.sequelize
    .sync()
    .then(async () => {
      console.log("Conectado al Servidor");
      await db.sequelize.close();
      connection.end();
    })
    .catch((error) => console.log(error));
});
