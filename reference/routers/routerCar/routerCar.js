const express = require("express");
const car = express.Router(); // имя роутера
const { jwt } = require("../../utils/jwt/checkJWT"); // проверка что jwt админа или просто то что jwt верный
const { validator } = require("../../middleware/validator/validatorBody");
const { createAuto, deleteAuot, getCarsAreBeingRented, getFilteredCars, getSearchCars, getAllCars, reclaimCar, rentCar } = require("../../controller/controllerAuto"); // контролерры

// Створення автівок - тільки адміном
car.post("/admin/creation-car", jwt.checkJWTadmin, validator.createAuto, validator.ValidationResult, createAuto);

// видалення автівок - тільки адміном
car.delete("/admin/:id", jwt.checkJWTadmin, validator.validatoParams, deleteAuot);

// Можливість бачити які автівки зараз в прокаті - адмін.
car.get("/admin/lease", jwt.checkJWTadmin, getCarsAreBeingRented);

// Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
car.get("/all-cars", jwt.checkJWT, getAllCars);

// можливість фільтрувати автівки що доступні  brand filter price админом и пользователем
car.get("/filtration", jwt.checkJWT, getFilteredCars);

// Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
car.get("/search", jwt.checkJWT, getSearchCars);

// брати на прокат автівку. Доки користувач користується автівкою він не може взяти ще одну. якщо авто в арнеді чи відаленне теж не може взяті
car.post("/lease", jwt.checkJWT, validator.validatorDate, validator.ValidationResult, rentCar);

// повернення авто тільки адміном
car.put("/admin/reclaim", jwt.checkJWTadmin, validator.validtoBodyReclaim, validator.ValidationResult, reclaimCar);

module.exports = car;
