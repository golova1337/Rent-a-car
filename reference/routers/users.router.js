const express = require("express");
const users = express.Router();
const { userValidator } = require("../helpers/validator/user.validator");
const Jwt = require("../middlewares/jwt/jwt");
const UsersController = require("../controllers/Users.controller");

// Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
users.post("/", Jwt.check, Jwt.Role(["superadmin"]), userValidator.singUP, userValidator.validationResult, UsersController.create);

// Видалення користувачів (Soft Delete) - адмін
users.delete("/:id", Jwt.check, Jwt.Role(["admin"]), userValidator.id, userValidator.validationResult, UsersController.delete);

// Можливість бачити всіх користувачів - адмін
users.get("/", Jwt.check, Jwt.Role(["admin"]), UsersController.getAll);

module.exports = users;