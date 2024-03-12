const express = require("express");
const cars = express.Router(); // имя роутера
const { checkJwt, checkRole } = require("../../middlewares/jwt/jwt");
const { validator } = require("../../middlewares/validator/validator");
const { createAuto, deleteAuot, getCarsAreBeingRented, getFilteredCars, getSearchCars, getAllCars, reclaimCar, rentCar } = require("../../controllers/Cars.controller"); // контролерры

// Створення автівок - тільки адміном
cars.post("/creation-car", checkJwt, checkRole("admin"), validator.validationResult, createAuto);

// видалення автівок - тільки адміном
cars.delete("/:id", checkJwt, checkRole("admin"), deleteAuot); //check data

// Можливість бачити які автівки зараз в прокаті - адмін.
cars.get("/lease", checkJwt, checkRole("admin"), getCarsAreBeingRented);

// Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
cars.get("/all-cars", checkJwt, checkRole("user"), getAllCars);

// можливість фільтрувати автівки що доступні  brand filter price админом и пользователем
cars.get("/filtration", checkJwt, checkRole("user"), getFilteredCars);

// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
cars.get("/search", checkJwt, checkRole("user"), getSearchCars);

// брати на прокат автівку. Доки користувач користується автівкою він не може взяти ще одну. якщо авто в арнеді чи відаленне теж не може взяті
cars.post("/lease", checkJwt, checkRole("user"), validator.validatorDate, validator.validationResult, rentCar);

// повернення авто тільки адміном
cars.put("/reclaim", checkJwt, checkRole("admin"), validator.validtorBodyReclaim, validator.validationResult, reclaimCar);

module.exports = cars;
