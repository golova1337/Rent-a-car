const { body,validationResult } = require('express-validator');


const LoginMiddleware = {
    ValidtoBodyLogin : [
        body('email').trim().notEmpty().isLength({ min: 4, max: 52 }).isEmail(),
        body('password').trim().notEmpty().isLength({ min: 10, max: 32 })
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
    "LoginMiddleware" : LoginMiddleware
}