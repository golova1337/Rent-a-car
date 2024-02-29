const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Pet project for rent cars",
      description: "A service providing operations for users and admins in the context of car rentals.",
      version: "1.0.0",
      contact: {
        email: "danilshkoda1998@gmail.com",
      },
    },
  },
  apis: ["reference/controller/controllerUsers.js", "reference/controller/controllerAuto.js"], // path к маршрутам с комментариями JSDoc
};

module.exports = options;
