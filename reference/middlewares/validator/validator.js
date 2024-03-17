const { body, param, validationResult } = require("express-validator");

const validator = {
  validtorBodySingUP: [
    body("name").trim().notEmpty().isLength({ min: 4, max: 32 }),
    body("lastname").trim().notEmpty().isLength({ min: 4, max: 52 }),
    body("email").trim().notEmpty().isLength({ min: 4, max: 52 }).isEmail(),
    body("password").trim().notEmpty().isLength({ min: 10, max: 32 }),
  ],

  validtorBodyLogin: [body("email").trim().notEmpty().isLength({ min: 4, max: 52 }).isEmail(), body("password").trim().notEmpty().isLength({ min: 10, max: 32 })],

  createAuto: [
    body("brand").trim().notEmpty().isLength({ min: 2, max: 20 }),
    body("model").trim().notEmpty().isLength({ min: 2, max: 20 }),
    body("number_plate").trim().notEmpty().isLength({ min: 2, max: 20 }),
    body("price")
      .trim()
      .notEmpty()
      .custom((value) => !Number.isNaN(value)),
    body("year")
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .custom((value) => !Number.isNaN(value)),
  ],

  validtorBodyCreateAdmin: [
    body("name").trim().notEmpty().isLength({ min: 4, max: 32 }),
    body("lastName").trim().notEmpty().isLength({ min: 4, max: 52 }),
    body("email").trim().notEmpty().isLength({ min: 4, max: 52 }).isEmail(),
    body("password").trim().notEmpty().isLength({ min: 10, max: 32 }),
  ],

  validtorBodyReclaim: [
    body("id")
      .trim()
      .notEmpty()
      .custom((value) => !Number.isNaN(value)),
  ],

  validatorParamsId: param("id").trim().notEmpty().isInt(),

  validatorDate: [
    body("start_time").exists().withMessage("Start date is required"),
    body("end_time").exists().withMessage("End date is required"),
    body("end_time")
      .custom((value, { req }) => {
        const start = new Date(req.body.start_time);
        const end = new Date(value);
        return end > start;
      })
      .withMessage("End date must be greater than or equal to start date"),
  ],

  validationResult: (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ [result.errors[0].msg]: result.errors[0].path });
    }
    next();
  },
};

module.exports = { validator };
