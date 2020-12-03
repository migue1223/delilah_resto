"use strict";

const db = require("../store/db");
const chalk = require("chalk");
const response = require("../network/response");

exports.listUser = async (req, res, next) => {
  try {
    const users = await db.user.findAll();
    response.success(req, res, users, 201);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-list"), err);
    response.error(req, res, err.message, 501);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      response.error(req, res, "", 404);
    }
    response.success(req, res, user, 201);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-findOne"), err);
    response.error(req, res, "Internal Server Error", 500);
  }
};

exports.insertUser = async (req, res, next) => {
  try {
    const { username, fullname, email, phone, address } = req.body;
    const { password } = req.body;

    const create = await db.user.create({
      username,
      fullname,
      email,
      phone,
      address,
    });
    if (create.dataValues) {
      const createAuth = await db.auth.create({
        password: await db.auth.prototype.generateHash(password),
        UserId: +create.dataValues.id,
      });
      response.success(req, res, "User created", 201);
    }
  } catch (err) {
    console.error(chalk.red("err-ctr-user-insert"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { username, fullname, email, phone, address } = req.body;
    const updateUser = await db.user.update(
      {
        username,
        fullname,
        email,
        phone,
        address,
      },
      { where: { id: req.params.id } }
    );
    response.success(req, res, updateUser, 201);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-update"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.enableUser = async (req, res, next) => {
  try {
    const { enable } = req.body;
    const enableUser = await db.user.update(
      {
        enable,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (enableUser.length > 0) {
      response.success(req, res, enableUser, 201);
    }
  } catch (err) {
    console.error(chalk.red("err-ctr-user-enable"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.enableAdmin = async (req, res, next) => {
  try {
    const { admin } = req.body;
    const enableAdmin = await db.user.update(
      {
        admin,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (enableAdmin.length > 0) {
      response.success(req, res, enableAdmin, 201);
    }
  } catch (err) {
    console.error(chalk.red("err-ctr-user-enable"), err);
    response.error(req, res, err.message, 500);
  }
};

exports.deletedUser = async (req, res, next) => {
  try {
    const deletedUser = await db.user.destroy({
      where: {
        id: req.params.id,
      },
    });
    response.success(req, res, deletedUser, 201);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-deleted"), err);
    response.error(req, res, err.message, 500);
  }
};
