"use strict";

const chalk = require("chalk");
const db = require("../../../store/db");

module.exports = function () {
  async function list() {
    try {
      return db.product.findAll();
    } catch (err) {
      console.error(chalk.red("ctr-prod-list"), err);
    }
  }

  async function get(req) {
    try {
      const product = await db.product.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (product !== null) {
        return product;
      } else {
        return "Not results";
      }
    } catch (err) {
      console.error(chalk.red("ctr-prod-getId"), err);
    }
  }

  async function insert(req) {
    try {
      const { name, img, price } = req.body;

      const create = await db.product.create({
        name,
        img,
        price,
      });
      if (create.dataValues) {
        return "Product created";
      }
    } catch (err) {
      console.error(chalk.red("ctr-prod-insert"), err);
      if (err.original.sqlMessage) {
        return "Product name already exists";
      }
    }
  }

  async function updated(body) {
    const product = {
      prod_id: body.id,
      prod_name: body.name,
      prod_img_url: body.url,
      prod_price: body.price,
      prod_enable: body.enable,
    };

    const insertId = await store.update(TABLA, product);
    if (insertId.insertId) {
      return product;
    }
  }

  async function deleted(req) {
    try {
    } catch (err) {
      console.error(chalk.red("ctr-prod-delete"), err);
    }
  }

  return {
    list,
    get,
    insert,
    updated,
    deleted,
  };
};
