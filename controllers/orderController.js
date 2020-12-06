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
    response.success(req, res, orders, 200);
  } catch (err) {
    console.error(chalk.red("ctr-order-list"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await getOrderId(req, res, req.params.id);
    response.success(req, res, order, 200);
  } catch (err) {
    console.error(chalk.red("ctr-order-get"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.getOrderUserId = async (req, res, next) => {
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
      if (getOrder.length >= 1) {
        response.success(req, res, getOrder, 200);
      } else {
        response.error(req, res, "Not found", 404);
      }
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-user-get"), err);
    response.error(req, res, err.message, 500);
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
          const result = await getOrderId(req, res, order.dataValues.id);
          response.success(req, res, result, 201);
        }
      }
    } else {
      response.error(req, res, "Conflict, invalid form of payment", 403);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-insert"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.updatedOrderStatus = async (req, res, next) => {
  try {
    if (+req.body.status <= 6) {
      const order = await db.order.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (order) {
        await db.order.update(
          {
            StatusId: req.body.status,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        const order = await getOrderId(req, res, req.params.id);
        response.success(req, res, order, 200);
      } else {
        response.error(req, res, "Not found", 404);
      }
    } else {
      response.error(req, res, "Status not found", 404);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-updated-order"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.deletedOrder = async (req, res, next) => {
  try {
    const order = await db.order.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (order) {
      await db.order.destroy({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });
      response.success(req, res, "Order cancelled", 200);
    } else {
      response.error(req, res, "Not fount", 404);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-delete"), err);
    response.error(req, res, err.message, 500);
  }
};

async function getOrderId(req, res, id) {
  const getOrder = await db.order.findAll({
    where: {
      order_id: +id,
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
  if (getOrder.length >= 1) {
    return getOrder;
  } else {
    response.error(req, res, "Not found", 404);
  }
}
