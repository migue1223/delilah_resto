const { response } = require("express");
const express = require("express");

const router = express.Router();

router.get("/", index);
router.get("/login", login);
router.get("/register", register);
router.get("/orders", orders)

function index(req, res, next) {
  res.redirect("/login");
}

function login(req, res, next) {
  res.render("login");
}

function register(req, res, next) {
  res.render("register");
}

function orders(req, res, next) {
  res.render("orders")
}
module.exports = router;
