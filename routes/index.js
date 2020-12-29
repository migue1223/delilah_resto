const express = require("express");
const router = express.Router();
const secure = require("../auth/secure");

const { body } = require("express-validator");

//import controller
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");

module.exports = function () {
  //auth
  router.post("/login", authController.login);

  //order
  router.get("/orders", secure("isEnable"), orderController.listOrder);
  router.get("/orders/:id", secure("isEnable"), orderController.getOrder);
  router.post("/orders", secure("isEnable"), orderController.insertOrder);
  router.put(
    "/orders/:id",
    secure("isEnable"),
    orderController.updatedOrderStatus
  );
  router.delete("/orders/:id", secure("isAdmin"), orderController.deletedOrder);

  //product
  router.get("/products", secure("isEnable"), productController.listProduct);
  router.get("/products/:id", secure("isEnable"), productController.getProduct);
  router.post(
    "/products",
    body("name").not().isEmpty().trim().escape(),
    body("img").not().isEmpty().trim(),
    body("price").isInt(),
    secure("isAdmin"),
    productController.insertProduct
  );
  router.put(
    "/products/:id",
    secure("isAdmin"),
    body("name").not().isEmpty().trim().escape(),
    body("img").not().isEmpty().trim(),
    body("price").isInt(),
    productController.updatedProduct
  );
  router.delete(
    "/products/:id",
    secure("isAdmin"),
    productController.deletedProduct
  );

  //user
  router.get("/users", secure("isAdmin"), userController.listUser);
  router.get("/users/:id", secure("isAdmin"), userController.getUser);
  router.post(
    "/users",
    body("username").not().isEmpty().trim().escape(),
    body("fullname").not().isEmpty().trim().escape(),
    body("email").isEmail(),
    body("phone").not().isEmpty().trim().escape(),
    body("address").not().isEmpty().trim().escape(),
    userController.insertUser
  );
  router.put(
    "/users/:id",
    secure("isEnable"),
    body("username").not().isEmpty().trim().escape(),
    body("fullname").not().isEmpty().trim().escape(),
    body("email").isEmail(),
    body("phone").not().isEmpty().trim().escape(),
    body("address").not().isEmpty().trim().escape(),
    userController.updateUser
  );
  router.delete("/users/:id", secure("isAdmin"), userController.deletedUser);

  return router;
};
