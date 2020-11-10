"use strict";

const express = require("express");
const response = require("../../../network/response");
const Controller = require("./controller");

const router = express.Router();

router.post("/login", login);

async function login(req, res) {
  try {
    const token = await Controller().login(req);
    response.success(req, res, token, 200);
  } catch (err) {
    response.error(req, res, err.message, 400);
  }
}

module.exports = router;
