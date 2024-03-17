const express = require("express");
const users = express.Router();
const { ControllerUsers } = require("../../controllers/Users.controller");
const { validator } = require("../../middlewares/validator/validator");
const { checkJwt, checkRole } = require("../../middlewares/jwt/jwt");

// Реєстрація користувачів
users.post("/", validator.validtorBodySingUP, validator.validationResult, ControllerUsers.signUp);

// Вхід в кабінет та отрімання JWT
users.post("/login", validator.validtorBodyLogin, validator.validationResult, ControllerUsers.login);

// Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
users.post("/creation-admin", checkJwt, checkRole(["superadmin"]), validator.validtorBodyCreateAdmin, validator.validationResult, ControllerUsers.create);

// Видалення користувачів (Soft Delete) - адмін
users.delete("/:id", checkJwt, checkRole(["admin"]), validator.validatorParamsId, validator.validationResult, ControllerUsers.delete);

// Можливість бачити всіх користувачів - адмін
users.get("/", checkJwt, checkRole(["admin"]), ControllerUsers.getAll);

module.exports = users;
