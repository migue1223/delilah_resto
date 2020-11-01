const bodyParser = require("body-parser");
const config = require("./config.js");
const cors = require("cors");
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const auth = require("./api/components/auth/network");
const index = require("./api/index");
const order = require("./api/components/order/network");
const product = require("./api/components/product/network");
const user = require("./api/components/user/network");

const errors = require("./network/errors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const swaggerDoc = require("./swagger.json");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

//routes api
app.use("/api/auth", auth);
app.use("/", index);
app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/product", product);

// routes docs api
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// redirect defatul
app.get("*", (req, res, next) => {
  res.redirect("/");
});

app.use(errors);

app.listen(config.api.port, () => {
  console.log(`Api escuchando el puerto: ${config.api.port}`);
});
