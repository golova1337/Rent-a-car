const express = require("express");
const users = express.Router();
const { validator } = require("../middlewares/validator/user.validator");
const Jwt = require("../middlewares/jwt/jwt");
const UsersController = require("../controllers/Users.controller");

// Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
users.post("/", Jwt.check, Jwt.Role(["superadmin"]), validator.singUP, validator.validationResult, UsersController.create);

// Видалення користувачів (Soft Delete) - адмін
users.delete("/:id", Jwt.check, Jwt.Role(["admin"]), validator.id, validator.validationResult, UsersController.delete);

// Можливість бачити всіх користувачів - адмін
users.get("/", Jwt.check, Jwt.Role(["admin"]), UsersController.getAll);

module.exports = users;

//req=>router=>middel=>control=>service=>repositoria=>config
