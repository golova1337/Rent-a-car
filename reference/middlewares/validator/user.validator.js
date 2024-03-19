const { body, param, validationResult } = require("express-validator");
const authorService = require("../../db/repository/Author.repository");

const validator = {
  singUP: [
    body("name").trim().notEmpty().isLength({ min: 4, max: 32 }),
    body("lastname").trim().notEmpty().isLength({ min: 4, max: 52 }),
    body("email")
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 52 })
      .isEmail()
      .custom(async (value) => {
        const user = await authorService.checkByEmail(value);
        if (user) {
          throw new Error("Conflict");
        }
      }),
    body("password").trim().notEmpty().isLength({ min: 10, max: 32 }),
  ],

  login: [
    body("email")
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 52 })
      .isEmail()
      .custom(async (value, { req }) => {
        const user = await authorService.checkByEmail(value);
        if (!user) {
          throw new Error("Conflict");
        }
        req.user = user;
      }),
    body("password").trim().notEmpty().isLength({ min: 10, max: 32 }),
  ],

  id: param("id").trim().notEmpty().isInt(),

  validationResult: (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ [result.errors[0].msg]: result.errors[0].path });
    }
    next();
  },
};

module.exports = { validator };
