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
          users_id: req.params.id,
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
        users_username: username,
        users_fullname: fullname,
        users_email: email,
        users_phone: phone,
        users_address: address,
      });
      if (create.dataValues) {
        await db.auth.create({
          auth_username: username,
          auth_email: email,
          auth_password: await db.auth.prototype.generateHash(password),
          UserUsersId: +create.dataValues.users_id,
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
    } catch (err) {
      console.error(chalk.red("err-ctr-user-update"), err);
    }
  }

  return {
    list,
    get,
    insert,
    update,
  };
};
