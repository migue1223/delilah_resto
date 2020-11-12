const express = require("express");
const router = express.Router();
const secure = require("../auth/secure");

//import controller
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");

module.exports = function () {
  //auth
  router.post("/login", authController.login);

  //order

  //product
  router.get("/product", secure("isEnable"), productController.listProduct);
  router.get("/product/:id", secure("isEnable"), productController.getProduct);
  router.post("/product", secure("isAdmin"), productController.insertProduc);
  router.put("/product/:id", secure("isAdmin"), productController.updatedProduct);
  router.delete("/product/:id", secure("isAdmin"), productController.deletedProduct);

  //user
  router.get("/user", secure("isAdmin"), userController.listUser);
  router.get("/user/:id", secure("isAdmin"), userController.getUser);
  router.post("/user", userController.insertUser);
  router.put("/user/:id", secure("update"), userController.updateUser);
  router.put("/user/enable/:id", secure("isAdmin"), userController.enableUser);
  router.put("/user/admin/:id", secure("isAdmin"), userController.enableAdmin);
  router.delete("/user/:id", secure("isAdmin"), userController.deletedUser);

  return router;
};
