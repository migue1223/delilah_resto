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
  router.get("/order", secure("isEnable"), orderController.listOrder);
  router.get("/order/:id", secure("isEnable"), orderController.getOrder);
  router.post("/order", secure("isEnable"), orderController.insertOrder);
  router.put(
    "/order/:id/status",
    secure("isEnable"),
    orderController.updatedOrderStatus
  );
  router.delete("/order/:id", secure("isAdmin"), orderController.deletedOrder);

  //product
  router.get("/product", secure("isEnable"), productController.listProduct);
  router.get("/product/:id", secure("isEnable"), productController.getProduct);
  router.post(
    "/product",
    body("name").not().isEmpty().trim().escape(),
    body("img").not().isEmpty().trim(),
    body("price").isInt(),
    secure("isAdmin"),
    productController.insertProduct
  );
  router.put(
    "/product/:id",
    secure("isAdmin"),
    body("name").not().isEmpty().trim().escape(),
    body("img").not().isEmpty().trim(),
    body("price").isInt(),
    productController.updatedProduct
  );
  router.delete(
    "/product/:id",
    secure("isAdmin"),
    productController.deletedProduct
  );

  //user
  router.get("/user", secure("isAdmin"), userController.listUser);
  router.get("/user/:id", secure("isAdmin"), userController.getUser);
  router.post(
    "/user",
    body("username").not().isEmpty().trim().escape(),
    body("fullname").not().isEmpty().trim().escape(),
    body("email").isEmail(),
    body("phone").not().isEmpty().trim().escape(),
    body("address").not().isEmpty().trim().escape(),
    userController.insertUser
  );
  router.put(
    "/user/:id",
    secure("isEnable"),
    body("username").not().isEmpty().trim().escape(),
    body("fullname").not().isEmpty().trim().escape(),
    body("email").isEmail(),
    body("phone").not().isEmpty().trim().escape(),
    body("address").not().isEmpty().trim().escape(),
    userController.updateUser
  );
  router.delete("/user/:id", secure("isAdmin"), userController.deletedUser);

  return router;
};
