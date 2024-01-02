const {body,validationResult} = require('express-validator');


const ValidtoBody = {
     CreateAuto : [
        body("Brand").trim().notEmpty().isLength({ min: 2, max: 20 }),
        body("Model").trim().notEmpty().isLength({ min: 2, max: 20 }),
        body("Number").trim().notEmpty().isLength({ min: 2, max: 20 }),
        body("Price").trim().notEmpty().custom(value=>!isNaN(value) ? true :false),
        body("Year").trim().notEmpty().isLength({ min: 4, max: 4 }).custom(value=>!isNaN(value) ? true :false)
    ],
    ValidationResult : (req,res,next)=> {
        const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.json({[result.errors[0].msg]: result.errors[0].path});
             }
             next()
    
      }

}

module.exports = {
    "ValidtoBody" :ValidtoBody
}

