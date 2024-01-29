const express  = require('express');
const router = express.Router();
const {signUp,login,createAdmin,deletedUser,getAllUsers} = require('../controller/controllerAuth')
const {RegistrationMiddleware} = require('../Middleware/validatorBodySignUp');
const {LoginMiddleware} = require('../Middleware/validatorBodyLogin');
const {CreateAdminMiddleware} = require('../Middleware/validatorBodyCreateAdmin');
const{checkJWT,checkJWTadmin,checkJWTSuperadmin} = require('../jwt/checkJWT');




router.post('/signUp',RegistrationMiddleware.ValidtoBodySingUP,RegistrationMiddleware.ValidationResult,signUp);

router.post('/login',LoginMiddleware.ValidtoBodyLogin,LoginMiddleware.ValidationResult,login);

router.post('/createAdmin',checkJWTSuperadmin,CreateAdminMiddleware.ValidtoBodyCreateAdmin,CreateAdminMiddleware.ValidationResult,createAdmin)
//Видалення користувачів (Soft Delete) - адмін
router.delete('/deletedUser',checkJWTadmin,deletedUser)
// Можливість бачити всіх користувачів - адмін
router.get('/getAllUsers',checkJWTadmin,getAllUsers)


module.exports = router;
