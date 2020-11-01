const express = require("express");
const response = require("../../../network/response");
const Controller = require("./index");

const router = express.Router();

router.get("/login", login);

async function login(req, res) {
  try {
    const token = await Controller.login(req.body);
    response.success(req, res, token, 200);
  } catch (error) {
    response.error(req, res, "Invalid information", 400);
  }
}

module.exports = router;
