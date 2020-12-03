"use strict";

const db = require("../store/db");
const { Op } = require("sequelize");
const chalk = require("chalk");
const jwt = require("../auth/");
const response = require("../network/response");

exports.login = async (req, res, next) => {
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
    if (getUser.dataValues.enable !== 0) {
      const auth_password = getUser.Auths[0].dataValues.password;
      const result = await db.auth.prototype.validPassword(
        password,
        auth_password
      );
      if (result) {
        const token = jwt.sign({
          id: getUser.dataValues.id,
          fullname: getUser.dataValues.fullname,
          email: getUser.dataValues.email,
          phone: getUser.dataValues.phone,
          address: getUser.dataValues.address,
          isAdmin: getUser.dataValues.admin,
          active: getUser.dataValues.enable,
        });
        return response.success(req, res, token, 201);
      }
    } else {
      return response.error(
        req,
        res,
        "Inactive user contact administrator",
        500
      );
    }
  } catch (err) {
    console.error(chalk.red("auth-ctr"), err);
    response.error(req, res, err.message, 500);
  }
};
