const auth = require("../../../auth");
const ControllerAuth = require("../auth/index");

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    let owner;
    switch (action) {
      case "update":
        owner = req.body.id;
        auth.check.own(req, owner);
        next();
        break;

      default:
        next();
    }
  }
  return middleware;
};
