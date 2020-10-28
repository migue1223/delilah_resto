const express = require("express");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");

const config = require("./config.js");
const auth = require("./api/components/auth/network");
const errors = require("./network/errors");
// const product = require("./api/components/product/network");
const user = require("./api/components/user/network");

const app = express();

app.use(bodyParser.json());

const swaggerDoc = require("./swagger.json");

app.use("/api/user", user);
app.use("/api/auth", auth);
// app.use("/api/product", product);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errors);

app.listen(config.api.port, () => {
  console.log(`Api escuchando el puerto: ${config.api.port}`);
});
