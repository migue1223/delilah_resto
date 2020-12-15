"use-strict";
require("dotenv").config();

const db = require("./db");
const mysql = require("mysql");
const config = require("../config/");
const bcrypt = require("bcrypt");

const dbconf = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
};

let connection;

function handleCon() {
  connection = mysql.createConnection(dbconf);

  connection.connect((err) => {
    if (err) {
      console.error("[db err]", err);
      setTimeout(handleCon, 2000);
    } else {
      console.log("DB Connected!");
    }
  });
}

handleCon();

const products = [
  {
    prod_name: "Bagel de salmón",
    prod_img_url:
      "https://okdiario.com/img/2018/12/03/bagel-de-salmon-655x368.jpg",
    prod_price: 100,
  },
  {
    prod_name: "Hamburguesa Clásica",
    prod_img_url:
      "https://sifu.unileversolutions.com/image/es-MX/recipe-topvisual/2/1260-709/hamburguesa-clasica-50425188.jpg",
    prod_price: 200,
  },
  {
    prod_name: "Sandwich veggie",
    prod_img_url:
      "https://danzadefogones.com/wp-content/fotos/Veggie-sandwich/Veggie-sandwich-4.jpg",
    prod_price: 100,
  },
  {
    prod_name: "Ensalada veggie",
    prod_img_url:
      "https://img-global.cpcdn.com/recipes/365784663a8df297/751x532cq70/ensalada-veggie-de-pepino-foto-principal.jpg",
    prod_price: 200,
  },
  {
    prod_name: "Focaccia",
    prod_img_url:
      "https://diariodegastronomia.com/wp-content/uploads/2019/05/Focaccia-casera-759x500.jpg",
    prod_price: 100,
  },
  {
    prod_name: "Sandwich de Focaccia",
    prod_img_url:
      "https://www.petitchef.es/imgupl/recipe/focaccia-sandwich--md-166713p249402.jpg",
    prod_price: 200,
  },
];

const payments = [
  {
    pay_name: "EFECTIVO",
  },
  {
    pay_name: "T DEBITO",
  },
  {
    pay_name: "T CREDITO",
  },
];

const status = [
  {
    status_name: "NUEVO",
  },
  {
    status_name: "CONFIRMADO",
  },
  {
    status_name: "PREPARANDO",
  },
  {
    status_name: "ENVIANDO",
  },
  {
    status_name: "ENTREGADO",
  },
  {
    status_name: "CANCELADO",
  },
];

async function insert(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function updatedDb(table, data) {
  data.forEach(async (item) => await insert(table, item));
}

async function createUser() {
  const user = {
    user_username: "admin",
    user_fullname: "Admin",
    user_email: "admin@admin.com",
    user_phone: "1234567890",
    user_address: "Cl 10 52A 18",
    user_admin: 1,
  };
  const insertUser = await insert("users", user);
  const auth = {
    auth_password: await bcrypt.hash("admin123", bcrypt.genSaltSync(10)),
    user_id: +insertUser.insertId,
  };
  await insert("auths", auth);
}

db.sequelize
  .sync()
  .then(async () => {
    console.log("Conectado al Servidor");
    await updatedDb("products", products);
    await updatedDb("payments", payments);
    await updatedDb("statuses", status);
    await createUser();
    await connection.end();
    await db.sequelize.close();
    console.log("Desconectado del Servidor");
  })
  .catch((error) => console.log(error));
