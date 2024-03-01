const express = require("express");
const cars = express.Router(); // имя роутера
const { checkJwt, checkRole } = require("../../middleware/jwt/checkJwt");
const { validator } = require("../../middleware/validator/validatorBody");
const { createAuto, deleteAuot, getCarsAreBeingRented, getFilteredCars, getSearchCars, getAllCars, reclaimCar, rentCar } = require("../../controller/controllerCars"); // контролерры

// Створення автівок - тільки адміном
cars.post("/admin/creation-car", checkJwt, checkRole("admin"), validator.ValidationResult, createAuto);

// видалення автівок - тільки адміном
cars.delete("/admin/:id", checkJwt, checkRole("admin"), validator.validatoParams, deleteAuot);

// Можливість бачити які автівки зараз в прокаті - адмін.
cars.get("/admin/lease", checkJwt, checkRole("admin"), getCarsAreBeingRented);

// Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
cars.get("/all-cars", checkJwt, checkRole("user"), getAllCars);

// можливість фільтрувати автівки що доступні  brand filter price админом и пользователем
cars.get("/filtration", checkJwt, checkRole("user"), getFilteredCars);

// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
cars.get("/search", checkJwt, checkRole("user"), getSearchCars);

// брати на прокат автівку. Доки користувач користується автівкою він не може взяти ще одну. якщо авто в арнеді чи відаленне теж не може взяті
cars.post("/lease", checkJwt, checkRole("user"), validator.validatorDate, validator.ValidationResult, rentCar);

// повернення авто тільки адміном
cars.put("/admin/reclaim", checkJwt, checkRole("admin"), validator.validtoBodyReclaim, validator.ValidationResult, reclaimCar);

module.exports = cars;
