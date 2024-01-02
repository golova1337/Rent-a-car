const { body,validationResult } = require('express-validator');

const CreateAdminMiddleware = {
    ValidtoBodyCreateAdmin: [
        body('name').trim().notEmpty().isLength({ min: 4, max: 32 }),
        body('lastName').trim().notEmpty().isLength({ min: 4, max: 52 }),
        body('email').trim().notEmpty().isLength({ min: 4, max: 52 }).isEmail(),
        body('password').trim().notEmpty().isLength({ min: 10, max: 32 })
      ],

      ValidationResult : (req,res,next)=> {
        const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.json(result.array() );
             }
             next()

      }

}

 


module.exports = {
    "CreateAdminMiddleware":CreateAdminMiddleware
}