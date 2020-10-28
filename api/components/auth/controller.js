const bcrypt = require("bcrypt");
const auth = require("../../../auth/index");
const TABLA = "auth";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("./index");
  }

  async function login(body) {
    if (body.username) {
      const user = await store.query(TABLA, {
        auth_username: body.username,
      });
      console.log(user);
      validatePassword(body.password, user.auth_password);
    }
    if (body.email) {
      const email = await store.query(TABLA, {
        auth_email: body.email,
      });
      console.log(email);
      validatePassword(body.password, email.auth_password);
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
    const validateUsername = await store.get(
      TABLA,
      "auth_username",
      data.username
    );
    const validateEmail = await store.get(TABLA, "auth_email", data.email);

    if (validateUsername.length > 0 || validateEmail.length > 0) {
      console.log(validateUsername);
      console.log(validateEmail);
      throw new Error("Conflict, username or email already exist");
    }
  }

  function validatePassword(passBody, passDb) {
    console.log("passBody", passBody);
    console.log("passDb", passDb);
    return bcrypt.compare(passBody, passDb).then((sonIguales) => {
      console.log("bcrypt", sonIguales);
      // if (sonIguales === true) {
      //   return auth.sign(data);
      // } else {
      //   throw new Error("Información invalida");
      // }
    });
  }

  return {
    login,
    insert,
    validateUser,
  };
};
