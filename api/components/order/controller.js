"use strict";

module.exports = function () {
 
  async function list() {
    return store.list(TABLA);
  }

  async function get(id) {
    return store.get(TABLA, id);
  }

  async function insert(body) {

    const user = {
      users_username: body.username,
      users_fullname: body.fullname,
      users_email: body.email,
      users_phone: body.phone,
      users_address: body.address,
      users_admin: 0,
      users_enable: 0,
    };

    const password = body.password;

    const insertId = await store.insert(TABLA, user);
    if (insertId.insertId) {
      const userId = await store.get(TABLA, "users_id", +insertId.insertId);
      if (userId[0].users_id) {
        await auth.insert({
          id: userId[0].users_id,
          email: userId[0].users_email,
          username: userId[0].users_username,
          password: password,
        });
      }
    }
    return user;
  }

  return {
    list,
    get,
    insert,
  };
};
