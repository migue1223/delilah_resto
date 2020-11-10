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
          [Op.or]: [{ username }, { email: username }],
        },
        include: [
          {
            model: db.auth,
          },
        ],
      });
      if (getUser.dataValues) {
        const auth_password = getUser.Auths[0].dataValues.password;
        const result = await db.auth.prototype.validPassword(
          password,
          auth_password
        );
        if (result) {
          return token.sign({
            id: getUser.dataValues.id,
            fullname: getUser.dataValues.fullname,
            email: getUser.dataValues.email,
            phone: getUser.dataValues.phone,
            address: getUser.dataValues.address,
            isAdmin: getUser.dataValues.admin,
            active: getUser.dataValues.enable,
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
