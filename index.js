"use strict";

const bodyParser = require("body-parser");
const config = require("./config.js");
const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const auth = require("./api/components/auth/network");
const order = require("./api/components/order/network");
const product = require("./api/components/product/network");
const user = require("./api/components/user/network");

const db = require("./store/db");

db.sequelize
  .sync()
  .then(() => console.log("Conectado al Servidor"))
  .catch((error) => console.log(error));

const errors = require("./network/errors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const swaggerDoc = require("./swagger.json");

//routes api
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/product", product);

// routes docs api
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errors);

app.listen(config.api.port, () => {
  console.log(`Api escuchando el puerto: ${config.api.port}`);
});
