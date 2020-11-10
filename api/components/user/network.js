"use strict";

const express = require("express");
const secure = require("./secure");
const response = require("../../../network/response");
const Controller = require("./controller");

const router = express.Router();

router.get("/", secure("isAdmin"), list);
router.get("/:id", secure("isAdmin"), get);
router.post("/", insert);
router.put("/", secure("isAdmin"), update);

async function list(req, res) {
  try {
    const list = await Controller().list();
    response.success(req, res, list, 200);
  } catch (error) {
    response.error(req, res, error.message, 500);
  }
}

async function get(req, res) {
  try {
    const userId = await Controller().get(req);
    response.success(req, res, userId, 200);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function insert(req, res) {
  try {
    const createUser = await Controller().insert(req);
    response.success(req, res, createUser, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function update(req, res) {
  try {
    const updateUser = await Controller().update(req)
  } catch (error) {
    response.error(req, res, error.message, 500);
  }
}

module.exports = router;
