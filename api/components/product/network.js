"use strict";

const express = require("express");
const secure = require("./secure");
const response = require("../../../network/response");
const Controller = require("./controller");

const router = express.Router();

router.get("/", secure("isEnable"), list);
router.get("/:id", secure("isEnable"), get);
router.post("/", secure("isAdmin"), insert);
router.put("/", secure("isAdmin"), updated);
router.delete("/:id", secure("isAdmin"), deleted);

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
    const getProduct = await Controller().get(req.params.id);
    response.success(req, res, getProduct, 200);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function insert(req, res) {
  try {
    const createProduct = await Controller().insert(req);
    response.success(req, res, createProduct, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function updated(req, res) {
  try {
    const updateProduct = await Controller().updated(req);
    response.success(req, res, updateProduct, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

async function deleted(req, res) {
  try {
    const deletedProduct = await Controller().deleted(req)
    response.success(req, res, deletedProduct, 201)
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
}

module.exports = router;
