"use strict";

const express = require("express");
const secure = require("./secure");
const response = require("../../../network/response");
const Controller = require("./controller");

const router = express.Router();

router.get("/", secure("isAdmin"), list);
router.get("/:id", secure("isAdmin"), get);
router.post("/", insert);
router.put("/:id", secure("isAdmin"), update);
router.put("/enable/:id", secure("isAdmin"), enableUser);
router.put("/admin/:id", secure("isAdmin"), enableAdmin);

async function list(req, res) {
  try {
    const list = await Controller().list();
    response.success(req, res, list, 200);
  } catch (err) {
    response.error(req, res, err.message, 500);
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
    const updateUser = await Controller().update(req);
    response.success(req, res, updateUser, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function enableUser(req, res) {
  try {
    const enableUser = await Controller().enableUser(req);
    response.success(req, res, enableUser, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function enableAdmin(req, res) {
  try {
    const enableAdmin = await Controller().enableAdmin(req);
    response.success(req, res, enableAdmin, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

module.exports = router;
