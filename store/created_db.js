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
        connection.end();
      }
    );
  });
}

createdDatabase();
