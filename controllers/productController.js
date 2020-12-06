"use strict";

const chalk = require("chalk");
const db = require("../store/db");
const response = require("../network/response");

exports.listProduct = async (req, res, next) => {
  try {
    const products = await db.product.findAll();
    response.success(req, res, products, 200);
  } catch (err) {
    console.error(chalk.red("ctr-prod-list"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await db.product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (product !== null) {
      response.success(req, res, product, 200);
    } else {
      response.success(req, res, "Not found", 404);
    }
  } catch (err) {
    console.error(chalk.red("ctr-prod-getId"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.insertProduc = async (req, res, next) => {
  try {
    const { name, img, price } = req.body;

    const create = await db.product.create({
      name,
      img,
      price,
    });
    if (create.dataValues) {
      response.success(req, res, create, 201);
    }
  } catch (err) {
    console.error(chalk.red("ctr-prod-insert"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.updatedProduct = async (req, res, next) => {
  try {
    const product = await db.product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (product) {
      const { name, price, img } = req.body;
      await db.product.update(
        {
          name,
          price,
          img,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      const productUpdated = await db.product.findOne({
        where: {
          id: req.params.id,
        },
      });
      response.success(req, res, productUpdated, 201);
    } else {
      response.error(req, res, "Not found", 404);
    }
  } catch (err) {
    console.error(chalk.red("ctr-prod-updated"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.deletedProduct = async (req, res, next) => {
  try {
    const product = await db.product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (product) {
      await db.product.destroy({
        where: {
          id: req.params.id,
        },
      });
      response.success(req, res, "The product has been removed", 200);
    } else {
      response.error(req, res, "Not found", 404);
    }
  } catch (err) {
    console.error(chalk.red("ctr-prod-delete"), err);
    response.error(req, res, err.message, 500);
  }
};
