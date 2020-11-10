"use strict"

module.exports = {
  remoteDB: process.env.REMOTE_DB || false,
  api: {
    port: process.env.API_PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dñlkfjapeiorq93837?X!|***+++---JHDYHOP927308;;;;....añsd34870fhoahg",
  },
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "root",
    database: process.env.MYSQL_DB || "delilah_resto",
    port: process.env.MYSQL_PORT || "3308",
  },
};
