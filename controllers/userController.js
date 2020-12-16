"use strict";

const { db } = require("../store/db_delilah");
const { QueryTypes } = require("sequelize");
const chalk = require("chalk");
const response = require("../network/response");
const bcrypt = require("bcrypt");

exports.listUser = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM `users`", {
      type: QueryTypes.SELECT,
    });
    const users = data.map((d) => {
      const user = {
        id: d.user_id,
        username: d.user_username,
        fullname: d.user_fullname,
        email: d.user_email,
        phone: d.user_phone,
        address: d.user_address,
        admin: d.user_admin,
        enable: d.user_enable,
        createAt: d.user_created_at,
      };
      return user;
    });
    response.success(req, res, users, 200);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-list"), err);
    response.error(req, res, err.message, 501);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await getUserId(+req.params.id);
    if (!user) {
      response.error(req, res, "Not found", 404);
    }
    response.success(req, res, user, 200);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-findOne"), err);
    response.error(req, res, "Internal Server Error", 500);
  }
};

exports.insertUser = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    let { password } = req.body;

    const create = await db.query(
      "INSERT INTO `users` (user_username, user_fullname, user_email, user_phone, user_address) VALUES (:username, :fullname, :email, :phone, :address)",
      {
        replacements: user,
        type: QueryTypes.INSERT,
      }
    );
    if (create.length > 0) {
      password = await bcrypt.hash(password, bcrypt.genSaltSync(10));
      await db.query(
        "INSERT INTO `auths` (auth_password, user_id) VALUES (:password, :user_id)",
        {
          replacements: {
            password,
            user_id: create[0],
          },
          type: QueryTypes.INSERT,
        }
      );
      const userCreated = await getUserId(+create[0]);
      response.success(req, res, userCreated, 201);
    }
  } catch (err) {
    console.error(chalk.red("err-ctr-user-insert"), err);
    response.error(req, res, err.original.sqlMessage, 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const getUser = await getUserId(+req.params.id);
    if (!getUser) {
      response.error(req, res, "Not found", 404);
    }

    if (req.body.username) {
      if (+req.user.isAdmin === 1) {
        await db.query(
          "UPDATE `users` SET user_username = :username, user_fullname = :fullname, user_email = :email, user_phone = :phone, user_address = :address WHERE user_id = :id",
          {
            replacements: {
              id: req.params.id,
              username: req.body.username,
              fullname: req.body.fullname,
              email: req.body.email,
              phone: req.body.phone,
              address: req.body.address,
            },
          },
          { type: QueryTypes.UPDATE }
        );
        const user = await getUserId(+req.params.id);
        response.success(req, res, user, 200);
        await comparePassword(+req.params.id, req.body.password);
      } else {
        if (+req.user.id === +req.params.id) {
          await db.query(
            "UPDATE `users` SET user_username = :username, user_fullname = :fullname, user_email = :email, user_phone = :phone, user_address = :address WHERE user_id = :id",
            {
              replacements: {
                id: req.user.id,
                username: req.body.username,
                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
              },
            },
            { type: QueryTypes.UPDATE }
          );
          const user = await getUserId(+req.user.id);
          response.success(req, res, user, 200);
          await comparePassword(+req.user.id, req.body.password);
        } else {
          response.error(req, res, "You can not do this", 401);
        }
      }
    } else {
      if (+req.user.isAdmin === 1) {
        if (req.query.enable || req.query.admin) {
          const userQuery = await updateUserQuery(req);
          response.success(req, res, userQuery, 200);
        }
      } else {
        response.error(req, res, "You can not do this", 401);
      }
    }
  } catch (err) {
    console.error(chalk.red("err-ctr-user-update"), err);
    response.error(req, res, err.original.sqlMessage, 500);
  }
};

async function updateUserQuery(req) {
  let replace;
  let params;
  if (req.query.enable) {
    params = "enable";
    replace = {
      id: req.params.id,
      enable: req.query.enable,
    };
  }
  if (req.query.admin) {
    params = "admin";
    replace = {
      id: req.params.id,
      admin: req.query.admin,
    };
  }
  await db.query(
    `UPDATE users SET user_${params} = :${params} WHERE user_id = :id`,
    {
      replacements: replace,
    }
  );
  const user = await getUserId(req.params.id);
  return user;
}

exports.deletedUser = async (req, res) => {
  try {
    const user = await getUserId(+req.params.id);
    if (!user) {
      response.error(req, res, "Not Found", 404);
    }
    await db.query(`DELETE FROM users WHERE user_id = :id`, {
      replacements: {
        id: req.params.id,
      },
      type: QueryTypes.DELETE,
    });
    response.success(req, res, "User has been deleted", 200);
  } catch (err) {
    console.error(chalk.red("err-ctr-user-deleted"), err);
    response.error(req, res, err.original.sqlMessage, 500);
  }
};

async function getUserId(id) {
  try {
    const getUser = await db.query(
      "SELECT * FROM `users` WHERE user_id = :id",
      {
        replacements: {
          id,
        },
        type: QueryTypes.SELECT,
      }
    );
    const user = {
      id: getUser[0].user_id,
      username: getUser[0].user_username,
      fullname: getUser[0].user_fullname,
      email: getUser[0].user_email,
      phone: getUser[0].user_phone,
      address: getUser[0].user_address,
      admin: getUser[0].user_admin,
      enable: getUser[0].user_enable,
      createAt: getUser[0].user_created_at,
    };
    return user;
  } catch (err) {
    console.error(chalk.red("get-user-id"), err);
  }
}

async function comparePassword(id, password) {
  const user = await db.query(
    "SELECT auths.auth_password FROM users INNER JOIN auths ON users.user_id = auths.user_id WHERE users.user_id = :id",
    {
      replacements: {
        id: +id,
      },
      type: QueryTypes.SELECT,
    }
  );
  const isEqual = await bcrypt.compareSync(password, user[0].auth_password);
  if (!isEqual) {
    const hashPass = await bcrypt.hash(password, bcrypt.genSaltSync(10))
    await db.query(
      "UPDATE auths SET auth_password = :password WHERE user_id = :id",
      {
        replacements: {
          password: hashPass,
          id: +id,
        },
        type: QueryTypes.UPDATE,
      }
    );
  }
}
