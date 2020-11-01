const jwt = require("jsonwebtoken");
const config = require("../config");
const error = require("../utils/error");

const secret = config.jwt.secret;

function sign(data) {
  return jwt.sign(data, secret);
}

function verify(token) {
  return jwt.verify(token, secret);
}

const check = {
  isAdmin: function (req) {
    const decoded = decodeHeader(req);
    if (decoded.permisos !== 1) {
      throw error("Unauthorized, contact the administrator", 401);
    }
  },
  isEnable: function (req) {
    const decoded = decodeHeader(req);
    if(decoded.activate !== 1) {
      throw error("Inactive user contact administrator", 401);
    }
  },
  logged: function (req) {
    const decoded = decodeHeader(req);
  },
};

function getToken(auth) {
  if (!auth) {
    throw error("No token comes", 401);
  }
  if (auth.indexOf("Bearer ") === -1) {
    throw error("Invalid format", 401);
  }
  let token = auth.replace("Bearer ", "");
  return token;
}

function decodeHeader(req) {
  const authorization = req.headers.authorization || "";
  const token = getToken(authorization);
  const decoded = verify(token);
  req.user = decoded;
  return decoded;
}

module.exports = {
  sign,
  check,
};
