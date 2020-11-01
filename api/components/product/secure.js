const auth = require("../../../auth");

module.exports = function checkAuth(action) {
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

      default:
        next();
    }
  }
  return middleware;
};
