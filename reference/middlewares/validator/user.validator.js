const { body, param, validationResult } = require("express-validator");
const authService = require("../../db/repository/Auth.repository");

const userValidator = {
  singUP: [
    body("name").trim().notEmpty().isLength({ min: 4, max: 32 }),
    body("lastname").trim().notEmpty().isLength({ min: 4, max: 52 }),
    body("email")
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 52 })
      .isEmail()
      .custom(async (value) => {
        const user = await authService.getByEmail(value);
        if (user) {
          throw new Error("BadRequest");
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
        const user = await authService.getByEmail(value);
        if (!user) {
          throw new Error("NotFound");
        } else if (user.deleted_at) {
          throw new Error("BadRequest");
        }
        req.user = user;
      }),
    body("password").trim().notEmpty().isLength({ min: 10, max: 32 }),
  ],

  id: param("id").trim().notEmpty().isInt(),

  validationResult: (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.errors[0].msg });
    }
    next();
  },
};

module.exports = { userValidator };
