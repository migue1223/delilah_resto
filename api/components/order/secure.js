const auth = require("../../../auth");

module.exports = function checkAuth(action) {
  function middleware(req, res, next) {
    let owner;
    switch (action) {
      case "list":
        auth.check.isAdmin(req);
        next();
        break;
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
