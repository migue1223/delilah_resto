"use strict";

const chalk = require("chalk");
const { db } = require("../store/db_delilah");
const response = require("../network/response");
const { QueryTypes } = require("sequelize");

exports.listProduct = async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM products`, {
      type: QueryTypes.SELECT,
    });
    const products = data.map((d) => {
      const product = {
        id: d.prod_id,
        name: d.prod_name,
        img: d.prod_img_url,
        price: d.prod_price,
        enable: d.prod_enable,
        createdAt: d.prod_create_at,
      };
      return product;
    });
    response.success(req, res, products, 200);
  } catch (err) {
    console.error(chalk.red("ctr-prod-list"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await getProductId(+req.params.id);
    if (!product) {
      response.success(req, res, "Not found", 404);
    }
    response.success(req, res, product, 200);
  } catch (err) {
    console.error(chalk.red("ctr-prod-getId"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.insertProduct = async (req, res) => {
  try {
    const { name, img, price } = req.body;

    const create = await db.query(
      "INSERT INTO `products` (prod_name, prod_img_url, prod_price) VALUES(:name, :img, :price)",
      {
        replacements: {
          name,
          img,
          price,
        },
        type: QueryTypes.INSERT,
      }
    );
    if (create.length > 0) {
      const product = await getProductId(+create[0]);
      response.success(req, res, product, 201);
    }
  } catch (err) {
    console.error(chalk.red("ctr-prod-insert"), err);
    response.error(req, res, err.original.sqlMessage, 500);
  }
};

exports.updatedProduct = async (req, res) => {
  try {
    const getProduct = await getProductId(+req.params.id);
    if (!getProduct) {
      response.error(req, res, "Not found", 404);
    }
    const product = {
      id: +req.params.id,
      name: req.body.name,
      img: req.body.img,
      price: req.body.price,
    };
    await db.query(
      "UPDATE `products` SET prod_name = :name, prod_img_url = :img, prod_price = :price WHERE prod_id = :id",
      {
        replacements: product,
        type: QueryTypes.UPDATE,
      }
    );
    const productUpdated = await getProductId(+req.params.id);
    response.success(req, res, productUpdated, 200);
  } catch (err) {
    console.error(chalk.red("ctr-prod-updated"), err);
    response.error(req, res, err.original.sqlMessage, 500);
  }
};

exports.deletedProduct = async (req, res) => {
  try {
    const product = await getProductId(+req.params.id);
    if (!product) {
      response.error(req, res, "Not found", 404);
    }

    await db.query("DELETE FROM `products` WHERE prod_id = :id", {
      replacements: {
        id: +req.params.id,
      },
      type: QueryTypes.DELETE,
    });
    response.success(req, res, "The product has been removed", 200);
  } catch (err) {
    console.error(chalk.red("ctr-prod-delete"), err);
    response.error(req, res, err.message, 500);
  }
};

async function getProductId(id) {
  try {
    const getProduct = await db.query(
      "SELECT * FROM `products` WHERE prod_id = :id",
      {
        replacements: {
          id,
        },
        type: QueryTypes.SELECT,
      }
    );
    const product = {
      id: getProduct[0].prod_id,
      name: getProduct[0].prod_name,
      img: getProduct[0].prod_img_url,
      price: getProduct[0].prod_price,
      enable: getProduct[0].prod_enable,
      createAt: getProduct[0].prod_create_at,
    };
    return product;
  } catch (err) {
    console.error(chalk.red("get-prod-id"), err);
  }
}
