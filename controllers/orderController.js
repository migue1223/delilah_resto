"use strict";

const chalk = require("chalk");
const db = require("../store/db");
const response = require("../network/response");

exports.listOrder = async (req, res, next) => {
  try {
    const orders = await db.order.findAll({
      include: [
        {
          model: db.user,
          attributes: ["fullname", "username", "email", "phone", "address"],
        },
        { model: db.status, attributes: ["name"] },
        { model: db.payment, attributes: ["name"] },
        {
          model: db.order_product,
          attributes: ["quantity", "price"],
          include: [{ model: db.product, attributes: ["name", "img"] }],
        },
      ],
      attributes: ["id", "created"],
    });
    response.success(req, res, orders, 201);
  } catch (err) {
    console.error(chalk.red("ctr-order-list"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await getOrderId(req, res);
    response.success(req, res, order, 201);
  } catch (err) {
    console.error(chalk.red("ctr-order-get"), err);
    response.error(req, res, err.message, 501);
  }
};

exports.getOrderUser = async (req, res, next) => {
  try {
    if (req.user.id) {
      const getOrder = await db.order.findAll({
        where: {
          user_id: +req.user.id,
        },
        attributes: ["id", "created"],
        include: [
          {
            model: db.user,
            attributes: ["fullname", "username", "email", "phone", "address"],
          },
          {
            model: db.status,
            attributes: ["name"],
          },
          { model: db.payment, attributes: ["name"] },
          {
            model: db.order_product,
            attributes: ["quantity", "price"],
            include: [{ model: db.product, attributes: ["name", "img"] }],
          },
        ],
      });
      response.success(req, res, getOrder, 201);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-user-get"), err);
    response.error(req, res, err.message, 501);
  }
};

exports.insertOrder = async (req, res, next) => {
  try {
    if (req.body.pay_id <= 3 && req.body.pay_id != 0) {
      const productsOrder = req.body.product.map((p) =>
        db.product.findOne({
          where: {
            id: p.id,
          },
        })
      );

      const productArray = await Promise.all(productsOrder);

      const order = await db.order.create({
        UserId: +req.user.id,
        PaymentId: +req.body.pay_id,
        StatusId: +1,
      });

      if (order) {
        const order_product = productArray.map((p, key) =>
          db.order_product.create({
            UserId: +req.user.id,
            OrderId: +order.dataValues.id,
            ProductId: +req.body.product[key].id,
            quantity: +req.body.product[key].quantity,
            price: +req.body.product[key].quantity * p.dataValues.price,
          })
        );
        await Promise.all(order_product);

        if (order_product) {
          const result = await getOrderId(req, res);
          response.success(req, res, result, 201);
        }
      }
    } else {
      response.error(req, res, "Conflict, invalid form of payment", 401);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-insert"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.updatedOrder = async (req, res, next) => {
  try {
    if (+req.body.status <= 5) {
      const updatedOrder = await db.order.update(
        {
          StatusId: req.body.status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (+updatedOrder[0] <= 1) {
        const order = await getOrderId(req, res);
        response.success(req, res, order, 201);
      } else {
        response.error(req, res, "Not found", 401);
      }
    } else {
      response.error(req, res, "Status not found", 401);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-updated-order"), err);
    response.error(req, res, err.message, 501);
  }
};

exports.deletedOrder = async (req, res, next) => {
  try {
    const delOrder = await db.order.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });
    if (+delOrder === 1) {
      response.success(req, res, "Order cancelled", 201);
    } else {
      response.error(req, res, "Not fount", 401);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-delete"), err);
    response.error(req, res, err.message, 501);
  }
};

async function getOrderId(req, res) {
  const getOrder = await db.order.findAll({
    where: {
      order_id: +req.params.id,
    },
    attributes: ["id", "created"],
    include: [
      {
        model: db.user,
        attributes: ["fullname", "username", "email", "phone", "address"],
      },
      {
        model: db.status,
        attributes: ["name"],
      },
      { model: db.payment, attributes: ["name"] },
      {
        model: db.order_product,
        attributes: ["quantity", "price"],
        include: [{ model: db.product, attributes: ["name", "img"] }],
      },
    ],
  });
  return getOrder;
}
