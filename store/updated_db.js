"use-strict";
require("dotenv").config();

const mysql = require("mysql");
const config = require("../config/");

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
  const result = data.forEach(async (item) => await insert(table, item));
  console.log(result);
}

updatedDb("products", products)
  .then(() => {
    updatedDb("payments", payments);
  })
  .then(() => {
    updatedDb("statuses", status);
  })
  .then(() => {
    connection.end();
  });
