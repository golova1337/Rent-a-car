const express = require("express");
const router = express.Router();
const { signUp, login, createAdmin, deletedUser, getAllUsers } = require("../../controller/controllerUsers");
const { validator } = require("../../middleware/validator/validatorBody");
const { checkJwt, checkRole } = require("../../middleware/jwt/checkJwt");

// Реєстрація користувачів
router.post("/registration", validator.validtoBodySingUP, validator.ValidationResult, signUp);

// Вхід в кабінет та отрімання JWT
router.post("/login", validator.validtoBodyLogin, validator.ValidationResult, login);

// Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
router.post("/superadmin/creation-admin", checkJwt, checkRole("superadmin"), validator.validtoBodyCreateAdmin, validator.ValidationResult, createAdmin);

// Видалення користувачів (Soft Delete) - адмін
router.delete("/admin/:id", checkJwt, checkRole("admin"), deletedUser);

// Можливість бачити всіх користувачів - адмін
router.get("/admin/all-users", checkJwt, checkRole("admin"), getAllUsers);

module.exports = router;
