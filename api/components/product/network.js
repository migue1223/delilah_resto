const express = require("express");
const secure = require("./secure");
const response = require("../../../network/response");
const Controller = require("./index");

const router = express.Router();

router.get("/", secure("isEnable"), list);
router.get("/:id", secure("isAdmin"), get);
router.post("/", secure("isAdmin"), insert);
router.put("/", secure("isAdmin"), update);

async function list(req, res) {
  try {
    const lista = await Controller.list();
    response.success(req, res, lista, 200);
  } catch (error) {
    response.error(req, res, error.message, 500);
  }
}

async function get(req, res) {
  try {
    const listaId = await Controller.get(req.params.id);
    response.success(req, res, listaId, 200);
  } catch (error) {
    response.error(req, res, error.message, 500);
  }
}

async function insert(req, res) {
  try {
    await Controller.insert(req.body);
    const productId = {
      product: "created",
    };
    response.success(req, res, productId, 201);
  } catch (error) {
    response.error(req, res, error.message, 500);
  }
}

async function update(req, res) {
  try {
    await Controller.update(req.body);
    const updatedId = {
      product: "updated",
    };
    response.success(req, res, updatedId, 201);
  } catch (error) {
    response.error(req, res, error.message, 500);
  }
}

module.exports = router;
