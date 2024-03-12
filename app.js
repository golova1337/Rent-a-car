require("dotenv").config();
const { knex } = require("./reference/db/config/createConnection");

const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = require("./reference/openApi/openApiDocument.js");
const app = express();
const usersRouter = require("./reference/routers/routerAutho/Users.router.js");
const carsRouter = require("./reference/routers/routerCars/Cars.router.js");

const Port = 5500;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/cars", carsRouter);

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
