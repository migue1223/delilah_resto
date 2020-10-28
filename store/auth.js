const connection = require("./mysql");

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

async function get(table, params, value) {
  return new Promise(async (resolve, reject) => {
    const db = await connection.handleCon();
    db.query(
      `SELECT * FROM ${table} WHERE ${params}="${value}"`,
      (err, data) => {
        console.log(err);
        if (err) return reject(err);
        resolve(data);
        db.end();
      }
    );
  });
}

async function query(table, query, join) {
  let joinQuery = "";
  if (join) {
    const key = Object.keys(join)[0];
    const val = join[key];
    joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
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
  insert,
  get,
  query,
};
