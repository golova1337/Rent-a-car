const express = require("express");
const cars = express.Router(); // имя роутера
const { checkJwt, checkRole } = require("../../middlewares/jwt/jwt");
const { validator } = require("../../middlewares/validator/validator");
const ControllerCar = require("../../controllers/Cars.controller");

// Створення автівок - тільки адміном
cars.post("/", checkJwt, checkRole(["admin"]), validator.validationResult, ControllerCar.create);

// Можливість бачити які автівки зараз доступні для прокату - користувач і адмін. // обєднаті з фільтрацєю
cars.get("/", checkJwt, checkRole(["user", "admin"]), ControllerCar.get);

// видалення автівок - тільки адміном
cars.delete("/:id", checkJwt, checkRole(["admin"]), ControllerCar.delete); // check data

// Можливість бачити які автівки зараз в прокаті - адмін.
cars.get("/lease", checkJwt, checkRole(["admin"]), ControllerCar.lease);

// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
cars.get("/search", checkJwt, checkRole(["user", "admin"]), ControllerCar.search);

// брати на прокат автівку. Доки користувач користується автівкою він не може взяти ще одну. якщо авто в арнеді чи відаленне теж не може взяті
cars.post("/lease", checkJwt, checkRole(["user", "admin"]), validator.validatorDate, validator.validationResult, ControllerCar.rent);

// повернення авто тільки адміном (чому не просто по id а через reclaim бо в майбутньому може буде обнова данних авто)
cars.put("/reclaim/:id", checkJwt, checkRole(["admin"]), ControllerCar.reclaim);

module.exports = cars;
