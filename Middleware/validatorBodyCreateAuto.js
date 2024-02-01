const { body, validationResult } = require("express-validator");

const ValidtoBody = {
  CreateAuto: [
    body("brand").trim().notEmpty().isLength({ min: 2, max: 20 }),
    body("model").trim().notEmpty().isLength({ min: 2, max: 20 }),
    body("numberPlate").trim().notEmpty().isLength({ min: 2, max: 20 }),
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
  ValidationResult: (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json({ [result.errors[0].msg]: result.errors[0].path });
    }
    next();
  },
};

module.exports = {
  ValidtoBody: ValidtoBody,
};
