require("dotenv").config();
const { knex } = require("./reference/db/config/createConnection");

const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = require("./reference/openApi/apiDoc");
const app = express();
const router = require("./reference/routers/routerAutho/routerUsers.js");
const car = require("./reference/routers/routerCar/routerCar.js");

const Port = 5500;

app.use(express.json());

app.use("/users", router);
app.use("/cars", car);

process.on("SIGINT", async () => {
  try {
    await knex.destroy();
    console.log("Connection is closed");
    process.exit(0);
  } catch (error) {
    console.error(`Error closing the connection: ${error}`);
    process.exit(1);
  }
});

//  Swagger
const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(Port, async () => {
  console.log(`Port,BD works ${Port}`);
});
