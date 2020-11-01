const bcrypt = require("bcrypt");
const auth = require("../../../auth/index");
const TABLA = "auth";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("./index");
  }

  async function login(body) {
    let user = [];
    const isEmail = validateEmail(body.username);
    const join = {
      table: "users",
      key: "users_id",
    };

    if (isEmail === true) {
      const data = await store.query(
        TABLA,
        {
          auth_email: body.username,
        },
        join
      );
      const isPass = await validatePassword(body.password, data.auth_password);
      if (isPass === true) {
        user.push({
          username: data.auth_username,
          email: data.auth_email,
          password: data.auth_password,
          permisos: data.users_admin,
          activate: data.users_enable
        });
        return auth.sign(user[0]);
      }
    } else {
      const data = await store.query(
        TABLA,
        {
          auth_username: body.username,
        },
        join
      );
      const isPass = await validatePassword(body.password, data.auth_password);
      if (isPass === true) {
        user.push({
          username: data.auth_username,
          email: data.auth_email,
          password: data.auth_password,
          permisos: data.users_admin,
          activate: data.users_enable
        });

        return auth.sign(user[0]);
      }
    }
  }

  async function insert(data) {
    const authData = {
      auth_id: data.id,
      auth_username: data.username,
      auth_email: data.email,
    };

    if (data.password) {
      authData.auth_password = await bcrypt.hash(data.password, 5);
    }

    return store.insert(TABLA, authData);
  }

  async function validateUser(data) {
    const isUsername = await store.get(
      TABLA,
      "auth_username",
      data.username
    );
    const isEmail = await store.get(TABLA, "auth_email", data.email);

    if (isUsername.length > 0 || isEmail.length > 0) {
      throw new Error("Conflict, username or email already exist");
    }
  }

  function validatePassword(passBody, passDb) {
    return bcrypt.compare(passBody, passDb).then((sonIguales) => {
      if (sonIguales === true) {
        return sonIguales;
      } else {
        throw new Error("Invalid information");
      }
    });
  }

  function validateEmail(email) {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  return {
    login,
    insert,
    validateUser,
  };
};
