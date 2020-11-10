"use strict";

const db = require("../../../store/db");
const { Op } = require("sequelize");
const chalk = require("chalk");
const token = require("../../../auth");

module.exports = function () {
  async function login(req) {
    try {
      const { username, password } = req.body;
      const getUser = await db.user.findOne({
        where: {
          [Op.or]: [{ users_username: username }, { users_email: username }],
        },
        include: [
          {
            model: db.auth,
          },
        ],
      });
      if (getUser.dataValues) {
        const auth_password = getUser.Auths[0].dataValues.auth_password;
        const result = await db.auth.prototype.validPassword(
          password,
          auth_password
        );
        if (result) {
          return token.sign({
            id: getUser.dataValues.users_id,
            fullname: getUser.dataValues.users_fullname,
            email: getUser.dataValues.users_email,
            phone: getUser.dataValues.users_phone,
            address: getUser.dataValues.users_address,
            isAdmin: getUser.dataValues.users_admin,
            active: getUser.dataValues.users_enable,
          });
        }
      }
    } catch (err) {
      console.error(chalk.red("auth-ctr"), err);
      return "Invalid information";
    }
  }

  return {
    login,
  };
};
