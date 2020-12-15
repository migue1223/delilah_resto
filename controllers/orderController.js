"use strict";

const chalk = require("chalk");
const { db } = require("../store/db_delilah");
const response = require("../network/response");
const { QueryTypes } = require("sequelize");

exports.listOrder = async (req, res) => {
  try {
    let where, replacements;
    if (req.user.isAdmin === 1) {
      where = "";
      replacements = "";
    }
    if (req.user.isAdmin === 0) {
      ("test-2");
      where = " WHERE orders.user_id = :id";
      replacements = {
        id: req.user.id,
      };
    }
    const getOrders = await db.query(
      `SELECT
        orders.order_id,
        orders.order_create_time,
        order__products.op_quantity,
        order__products.op_price,
        products.prod_name,
        products.prod_img_url,
        products.prod_price,
        users.user_username,
        users.user_fullname,
        users.user_email,
        users.user_phone,
        users.user_address,
        payments.pay_name,
        statuses.status_name
      FROM
        delilah_resto.orders
      INNER JOIN order__products ON order__products.order_id = orders.order_id
      INNER JOIN products ON products.prod_id = order__products.product_id
      INNER JOIN users ON users.user_id = order__products.user_id
      INNER JOIN statuses ON statuses.status_id = orders.status_id
      INNER JOIN payments ON payments.pay_id = orders.payment_id${where}`,
      { replacements: replacements, type: QueryTypes.SELECT }
    );
    if (!getOrders.length) {
      return response.error(req, res, "Not found", 404);
    }
    const orders = await reducerOrders(getOrders);
    response.success(req, res, orders, 200);
  } catch (err) {
    console.error(chalk.red("list-orders"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.getOrder = async (req, res) => {
  try {
    let where, replacements;
    if (req.params.id && req.user.isAdmin === 1) {
      where = " WHERE orders.order_id = :id";
      replacements = {
        id: req.params.id,
      };
    }
    if (req.params.id && req.user.isAdmin === 0) {
      where = " WHERE orders.order_id = :orderId AND orders.user_id = :userId";
      replacements = {
        orderId: req.params.id,
        userId: req.user.id,
      };
    }
    const getOrders = await db.query(
      `SELECT
        orders.order_id,
        orders.order_create_time,
        order__products.op_quantity,
        order__products.op_price,
        products.prod_name,
        products.prod_img_url,
        products.prod_price,
        users.user_username,
        users.user_fullname,
        users.user_email,
        users.user_phone,
        users.user_address,
        payments.pay_name,
        statuses.status_name
      FROM
        delilah_resto.orders
      INNER JOIN order__products ON order__products.order_id = orders.order_id
      INNER JOIN products ON products.prod_id = order__products.product_id
      INNER JOIN users ON users.user_id = order__products.user_id
      INNER JOIN statuses ON statuses.status_id = orders.status_id
      INNER JOIN payments ON payments.pay_id = orders.payment_id${where}`,
      { replacements: replacements, type: QueryTypes.SELECT }
    );
    if (!getOrders.length) {
      return response.error(req, res, "Not found", 404);
    }
    const order = await reducerOrders(getOrders);
    response.success(req, res, order, 200);
  } catch (err) {
    console.error(chalk.red("ctr-order-get"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.insertOrder = async (req, res) => {
  try {
    if (req.body.pay_id <= 3 && req.body.pay_id != 0) {
      const productsOrder = req.body.product.map((p) =>
        db.query("SELECT * FROM products WHERE prod_id = :id", {
          replacements: {
            id: +p.id,
          },
          type: QueryTypes.SELECT,
        })
      );

      const productArray = await Promise.all(productsOrder);

      if (!productArray) {
        response.error(req, res, "Not products found", 404);
      }

      const order = await db.query(
        "INSERT INTO `orders` (user_id, payment_id, status_id) VALUES (:userId, :payId, :statusId)",
        {
          replacements: {
            userId: +req.user.id,
            payId: +req.body.pay_id,
            statusId: +1,
          },
          type: QueryTypes.INSERT,
        }
      );

      if (order) {
        const order_product = productArray.map((p, key) =>
          db.query(
            "INSERT INTO order__products (user_id, order_id, product_id, op_quantity, op_price) VALUES (:userId, :orderId, :prodId, :quantity, :price)",
            {
              replacements: {
                userId: +req.user.id,
                orderId: +order[0],
                prodId: +req.body.product[key].id,
                quantity: +req.body.product[key].quantity,
                price: +req.body.product[key].quantity * p[0].prod_price,
              },
              type: QueryTypes.INSERT,
            }
          )
        );
        await Promise.all(order_product);

        if (order_product) {
          const result = await getOrderId(order[0]);
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

exports.updatedOrderStatus = async (req, res) => {
  try {
    if (+req.body.status <= 6) {
      const getOrder = await getOrderId(+req.params.id);
      if (!getOrder.length) {
        response.error(req, res, "Not found", 404);
      }

      await db.query(
        "UPDATE orders SET status_id = :statusId WHERE order_id = :orderId",
        {
          replacements: {
            statusId: +req.body.status,
            orderId: +req.params.id,
          },
          type: QueryTypes.UPDATE,
        }
      );
      const order = await getOrderId(+req.params.id);
      response.success(req, res, order, 200);
    } else {
      response.error(req, res, "Status not found", 404);
    }
  } catch (err) {
    console.error(chalk.red("ctr-order-updated-order"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.deletedOrder = async (req, res) => {
  try {
    const order = await getOrderId(+req.params.id);
    if (!order.length) {
      response.error(req, res, "Not found", 404);
    }

    await db.query("DELETE FROM orders WHERE order_id = :id", {
      replacements: {
        id: +req.params.id,
      },
    });
    response.success(req, res, "Order cancelled", 200);
  } catch (err) {
    console.error(chalk.red("ctr-order-delete"), err);
    response.error(req, res, err.message, 500);
  }
};

async function getOrderId(id) {
  const getOrder = await db.query(
    `SELECT
      orders.order_id,
      orders.order_create_time,
      order__products.op_quantity,
      order__products.op_price,
      products.prod_name,
      products.prod_img_url,
      products.prod_price,
      users.user_username,
      users.user_fullname,
      users.user_email,
      users.user_phone,
      users.user_address,
      payments.pay_name,
      statuses.status_name
    FROM
      delilah_resto.orders
    INNER JOIN order__products ON order__products.order_id = orders.order_id
    INNER JOIN products ON products.prod_id = order__products.product_id
    INNER JOIN users ON users.user_id = order__products.user_id
    INNER JOIN statuses ON statuses.status_id = orders.status_id
    INNER JOIN payments ON payments.pay_id = orders.payment_id WHERE orders.order_id = :id`,
    {
      replacements: {
        id: id,
      },
      type: QueryTypes.SELECT,
    }
  );
  const order = await reducerOrders(getOrder);
  return order;
}

async function reducerOrders(orders) {
  const result = orders.reduce((acc, d) => {
    const found = acc.find((a) => a.id === d.order_id);
    const product = {
      quantity: d.op_quantity,
      price: d.op_price,
      Product: {
        name: d.prod_name,
        img: d.prod_img_url,
        price: d.prod_price,
      },
    };
    const user = {
      fullname: d.user_fullname,
      username: d.user_username,
      email: d.user_email,
      phone: d.user_phone,
      address: d.user_address,
    };
    const status = {
      name: d.status_name,
    };
    const pay = {
      name: d.pay_name,
    };
    if (!found) {
      acc.push({
        id: d.order_id,
        created: d.order_create_time,
        User: user,
        Status: status,
        Payment: pay,
        Order_Products: [product],
      });
    } else {
      found.Order_Products.push(product);
    }
    return acc;
  }, []);
  return result;
}
