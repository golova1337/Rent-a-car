const express = require("express");
const author = express.Router();
const { userValidator } = require("../middlewares/validator/user.validator");
const authController = require("../controllers/Auth.controller");

// Реєстрація користувачів
author.post("/signup", userValidator.singUP, userValidator.validationResult, authController.signUp);

// Вхід в кабінет та отрімання JWT
author.post("/login", userValidator.login, userValidator.validationResult, authController.login);

module.exports = author;
