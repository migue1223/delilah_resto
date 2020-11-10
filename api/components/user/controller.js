"use strict";

const db = require("../../../store/db");
const chalk = require("chalk");

module.exports = function () {
  async function list() {
    try {
      return await db.user.findAll();
    } catch (err) {
      console.error(chalk.red("err-ctr-user-list"), err);
    }
  }

  async function get(req) {
    try {
      const user = await db.user.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (user !== null) {
        return user;
      } else {
        return "Not results";
      }
    } catch (err) {
      console.error(chalk.red("err-ctr-user-findOne"), err);
    }
  }

  async function insert(req) {
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
        return "User created";
      }
    } catch (err) {
      console.error(chalk.red("err-ctr-user-insert"), err);
      if (err.original.sqlMessage) {
        return "User or email already exists";
      }
    }
  }

  async function update(req) {
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
      if (updateUser.length > 0) {
        return "User updated";
      }
    } catch (err) {
      console.error(chalk.red("err-ctr-user-update"), err);
      return "User or email already exists";
    }
  }

  async function enableUser(req) {
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
        return "User udpated";
      }
    } catch (err) {
      console.error(chalk.red("err-ctr-user-enable"), err);
    }
  }

  async function enableAdmin(req) {
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
        return "User udpated";
      }
    } catch (err) {
      console.error(chalk.red("err-ctr-user-enable"), err);
    }
  }

  return {
    list,
    get,
    insert,
    update,
    enableUser,
    enableAdmin,
  };
};
