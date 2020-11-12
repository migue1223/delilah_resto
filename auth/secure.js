"use strict";

const auth = require("./");

module.exports = function checkAuth(action, options) {
  function middleware(req, res, next) {
    switch (action) {
      case "isAdmin":
        auth.check.isAdmin(req);
        next();
        break;
      case "isEnable":
        auth.check.isEnable(req);
        next();
        break;
      case "update":
        auth.check.updated(req);
        next();
        break;
      default:
        next();
    }
  }
  return middleware;
};
