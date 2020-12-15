"use strict";

const { db } = require("../store/db_delilah");
const chalk = require("chalk");
const jwt = require("../auth/");
const response = require("../network/response");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const getUser = await db.query(
      `SELECT * FROM users WHERE user_username = :username OR user_email = :username`,
      {
        replacements: {
          username,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (!getUser.length) {
      return response.error(req, res, "User or email does not exist", 404);
    }
    if (getUser[0].user_enable !== 1) {
      return response.error(
        req,
        res,
        "Inactive user contact administrator",
        401
      );
    }
    const auth = await db.query(`SELECT * FROM auths WHERE user_id = :id`, {
      replacements: {
        id: getUser[0].user_id,
      },
      type: QueryTypes.SELECT,
    });
    const auth_password = auth[0].auth_password;
    const result = await bcrypt.compareSync(password, auth_password);
    if (!result) {
      return response.error(req, res, "Incorrect password", 403);
    }
    const token = jwt.sign({
      id: getUser[0].user_id,
      fullname: getUser[0].user_fullname,
      email: getUser[0].user_email,
      phone: getUser[0].user_phone,
      address: getUser[0].user_address,
      isAdmin: getUser[0].user_admin,
      active: getUser[0].user_enable,
    });
    return response.success(req, res, token, 200);
  } catch (err) {
    console.error(chalk.red("auth-ctr"), err);
    response.error(req, res, err.message, 500);
  }
};
