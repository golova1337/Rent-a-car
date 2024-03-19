const express = require("express");
const author = express.Router();
const { validator } = require("../middlewares/validator/user.validator");
const authorController = require("../controllers/Author.controller");
// Реєстрація користувачів
author.post("/", validator.singUP, validator.validationResult, authorController.signUp);

// Вхід в кабінет та отрімання JWT
author.post("/login", validator.login, validator.validationResult, authorController.login);

module.exports = author;
