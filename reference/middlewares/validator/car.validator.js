const { body, param, validationResult } = require("express-validator");

const carValidator = {
  create: [
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

  idBody: [body("car_id").trim().notEmpty().isInt()],

  idParam: [param("id").trim().notEmpty().isInt()],

  date: [
    body("start_time")
      .exists()
      .withMessage("Start date is required")
      .custom((value) => new Date(value) >= new Date()),
    body("end_time").exists().withMessage("End date is required"),
    body("end_time").custom((value, { req }) => {
      const start = new Date(req.body.start_time);
      const end = new Date(value);
      return end > start && end > new Date();
    }),
  ],

  validationResult: (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ [result.errors[0].msg]: result.errors[0].path });
    }
    next();
  },
};

module.exports = { carValidator };
