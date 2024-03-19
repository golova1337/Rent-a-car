const express = require("express");
const cars = express.Router(); // имя роутера
const Jwt = require("../middlewares/jwt/jwt");
const { validator } = require("../middlewares/validator/car.validator");
const CarsController = require("../controllers/Cars.controller");

// Створення автівок - тільки адміном
cars.post("/", Jwt.check, Jwt.Role(["admin"]), validator.validationResult, CarsController.create);

// Можливість бачити які автівки зараз доступні для прокату - користувач і адмін. // обєднаті з фільтрацєю
cars.get("/", Jwt.check, Jwt.Role(["user", "admin"]), CarsController.get);

// видалення автівок - тільки адміном
cars.delete("/:id", Jwt.check, Jwt.Role(["admin"]), validator.id, validator.validationResult, CarsController.delete);

// Можливість бачити які автівки зараз в прокаті - адмін.
cars.get("/lease", Jwt.check, Jwt.Role(["admin"]), CarsController.lease);

// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
cars.get("/search", Jwt.check, Jwt.Role(["user", "admin"]), CarsController.search);

// брати на прокат автівку. Доки користувач користується автівкою він не може взяти ще одну. якщо авто в арнеді чи відаленне теж не може взяті
cars.post("/lease", Jwt.check, Jwt.Role(["user", "admin"]), validator.date, validator.validationResult, CarsController.rent);

// повернення авто тільки адміном (чому не просто по id а через reclaim бо в майбутньому може буде обнова данних авто)
cars.put("/reclaim/:id", Jwt.check, Jwt.Role(["admin"]), CarsController.reclaim);

module.exports = cars;
