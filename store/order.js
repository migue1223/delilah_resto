const connection = require("./mysql");

async function list(table) {
  return new Promise(async (resolve, reject) => {
    const db = await connection.handleCon();
    db.query(`SELECT * FROM ${table}`, (err, data) => {
      if (err) return reject(err);
      resolve(data);
      db.end();
    });
  });
}

async function get(table, params, value) {
  return new Promise(async (resolve, reject) => {
    const db = await connection.handleCon();
    db.query(`SELECT * FROM ${table} WHERE ${params}="${value}"`, (err, data) => {
      console.log(err);
      if (err) return reject(err);
      resolve(data);
      db.end();
    });
  });
}

async function insert(table, data) {
  return new Promise(async (resolve, reject) => {
    const db = await connection.handleCon();
    db.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
      db.end();
    });
  });
}

async function update(table, data) {
  return new Promise(async (resolve, reject) => {
    const db = await connection.handleCon();
    db.query(
      `UPDATE ${table} SET ? WHERE users_id=?`,
      [data, data.id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
        db.end();
      }
    );
  });
}

async function query(table, query, join) {
  let joinQuery = "";
  if (join) {
    joinQuery = `JOIN ${join.table} ON ${join.table}.${join.key} = ${table}.auth_id`;
  }
  return new Promise(async (resolve, reject) => {
    const db = await connection.handleCon();
    db.query(
      `SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`,
      query,
      (err, res) => {
        if (err) return reject(err);
        res = JSON.stringify(res[0]);
        res = JSON.parse(res);
        resolve(res || null);
        db.end();
      }
    );
  });
}

module.exports = {
  list,
  get,
  insert,
  update,
  query,
};
