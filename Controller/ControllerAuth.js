const {knex} = require('../bd/createConnection');
const {CheckExistUserBDlogin} = require('../bd/check/checkExistUserBDlogin');
const {CheckExistUserBDsignUp} = require('../bd/check/checkExistUserBDsignUp')
const {InsertNewUser} = require('../BD/InsertNewUser')
const { Users, Admin, SuperAdmin } = require('../ClassUsers/SuperClass')
const {HashingPassword} = require('../Bcrypt/HashingPassword')
const {ComparePassword} = require('../Bcrypt/ComparePassword');
const {CreateJWT} = require('../jwt/createJWB');
const {DeleteUserBD} = require('../bd/deleteUserBd');
const {getAllUsersBd} = require('../BD/getAllUsresBd')
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWT:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: format JWT
 *
 *   parameters:
 *     DeleteUser:
 *       name: email
 *       in: query
 *       description: "user's email"
 *       required: true
 *       schema:
 *         type: string
 *
 *     DeleteCar:
 *       name: Number_plate
 *       in: query
 *       description: number_plate
 *       required: true
 *       schema:
 *         type: string
 *
 *     FilterCarBrand:
 *       in: query
 *       name: brand
 *       description: Brand car 
 *       schema:
 *         type: string
 *
 *     FilterCarbrandModel:
 *       in: query
 *       name: model
 *       description: model car
 *       schema:
 *         type: string
 *
 *     FilterCarbrandYear:
 *       in: query
 *       name: year
 *       description: year of a car
 *       schema:
 *         type: integer
 *
 *     FilterCarbrandPrice:
 *       in: query
 *       name: price
 *       description: price of a car
 *       schema:
 *         type: string
 *
 *   schemas:
 *     ResponseObjectCreateAdmin:
 *       type: object
 *       properties:
 *         message:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               maxLength: 32
 *               minLength: 4
 *               example: "Vasya"
 *             lastName:
 *               type: string
 *               maxLength: 32
 *               minLength: 4
 *               example: "Pupkin"
 *             role:
 *               type: string
 *               enum:
 *                 - admin
 *             email:
 *               type: string
 *               format: email
 *               example: "vasyapupkin@gmail.com"
 *
 *     BodyObjectSignUp:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 32
 *           minLength: 4
 *           example: "Vasya"
 *         lastName:
 *           type: string
 *           maxLength: 32
 *           minLength: 4
 *           example: "Pupkin"
 *         password:
 *           type: string
 *           maxLength: 32
 *           minLength: 10
 *           example: "qwerty12345"
 *         email:
 *           type: string
 *           format: email
 *           example: "vasyapupkin@gmail.com"
 *
 *     GetALLUsers:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: "User's first name"
 *         lastName:
 *           type: string
 *           description: "User's last name"
 *         email:
 *           type: string
 *           format: email
 *           description: "User's email address"
 *       example:
 *         name: "Kseniya"
 *         lastName: "Kaplya"
 *         email: "kseniyaKaplya@gmail.com"
 *
 *     FilterAuto:
 *       type: object
 *       properties:
 *         Brand:
 *           type: string
 *           maxLength: 20
 *           minLength: 2
 *           example: "BMW"
 *         Model:
 *           type: string
 *           maxLength: 20
 *           minLength: 2
 *           example: "m5"
 *         Price:
 *           type: integer
 *           maxLength: 5
 *           minLength: 2
 *           example: 1500
 *         Year:
 *           type: integer
 *           maxLength: 4
 *           minLength: 4
 *           example: 2020
 *     RequestObjectCreateAuto:
 *       allOf:
 *         - $ref: "#/components/schemas/FilterAuto"
 *         - type: object
 *           properties:
 *             Number:
 *              type: string
 *              maxLength: 20
 *              minLength: 2
 *              example: AX1337
 *     ResponseObjectCreateAuto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Car was created"
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "verification was unsuccessful"
 */

//регестрація юзера та занесення його в бд БЕЗ видачі JWT
/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: "Register a new user and obtain a JSON Web Token (JWT)"
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BodyObjectSignUp"
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User was successfully created."
 *       '400':
 *         description: Bad Request, invalid data. Please review the property values.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: Invalid data
 *                 value:
 *                   error: "Invalid value: password or another property"
 *               example2:
 *                 summary: User already exists
 *                 value:
 *                   error: "User already exists"
 */
const signUp = async (req,res)=>{
        try {
            const {name,lastName,email,password} = req.body;
            await CheckExistUserBDsignUp(knex,email);
            const newUser = new Users (name,lastName,email);
            const HashResult = await HashingPassword(password);
            await InsertNewUser(knex,newUser.name,newUser.lastName,newUser.email,HashResult,newUser.role);
            return res.status(201).json({you:'was created'}).end()
        } catch (error) {
            return res.status(400).json(error.message)
        }
}


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user and obtain a JSON Web Token (JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 maxLength: 32
 *                 minLength: 10
 *                 example: "qwerty12345"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "vasyapupkin@gmail.com"
 *             required:
 *               - email
 *               - password
 *     tags:
 *       - user
 *     responses:
 *       '200':
 *         description: User login successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "You logged on into the account. JWT received."
 *       '401':
 *         description: Bad Request, invalid data or email is wrong.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: Invalid data
 *                 value:
 *                   error: "Password is wrong"
 *               example2:
 *                 summary: User does not exist
 *                 value:
 *                   error: "User does not exist"
 */
//вхід та видача JWT с  ролью юзера
const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const {role,password_hash} = await CheckExistUserBDlogin(knex,email);

        const resultComparePassword = await ComparePassword(password,password_hash);
        if (!resultComparePassword) res.status(401).json('Password is wrong').end()
        
        const token = await CreateJWT(email,role)
        return res.status(200).json({'You logged on into the  account':token}).end()
        

    } catch (error) {
        return res.status(500).json({ error: error.message });
    };

}


/**
 * @swagger
 * /createAdmin:
 *   post:
 *     summary: Create an admin (accessible only for SuperAdmin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BodyObjectSignUp"
 *     security:
 *       - JWT: []
 *     tags:
 *       - user
 *     responses:
 *       '201':
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseObjectCreateAdmin"
 *       '400':
 *         description: Bad Request, invalid data. Please review the property values.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: Invalid data
 *                 value:
 *                   error: "Invalid value: password or another property"
 *               example2:
 *                 summary: Admin already exists
 *                 value:
 *                   error: "Admin already exists"
 *       '401':
 *         description: verefication was unsuccessful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 */
// Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
const createAdmin = async (req,res)=>{
    const {name,lastName,email,password} = req.body;
    try {
         await CheckExistUserBDsignUp(knex,email);
        const hash = await HashingPassword(password);
        const NewAdmin = SuperAdmin.CreateAdmin(name,lastName,email,hash);
         await InsertNewUser(knex,name,lastName,email,hash,NewAdmin.role);
        return res.status(201).json({message:NewAdmin}).end()
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


/**
 * @swagger
 * /deletedUser:
 *   delete:
 *     summary: "Admin can delete a user"
 *     tags:
 *       - user
 *     parameters:
 *       - $ref: "#/components/parameters/DeleteUser"
 *     security:
 *       - JWT: []
 *     responses:
 *       '200':
 *         description: User was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 "user's email":
 *                   type: string
 *                   example: "was deleted"
 *       '401':
 *         description: Verification was unsuccessful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *       '500':
 *         description: Verification was unsuccessful
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: Invalid data
 *                 value:
 *                   ReferenceError: email is not defined
 */
//Видалення користувачів (Soft Delete) - адмін
const deletedUser = async (req,res)=>{
   try {
    if (!req.query.email) throw new Error('Enter the data');
    await DeleteUserBD(knex,req.query.email)
    return res.status(200).json({[req.query.email]:'was deleted'})
   } catch (error) {
    return res.status(500).json(error.message).end()
   }
}

/**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: "Get all users only admin"
 *     tags:
 *       - user
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: role
 *         in: query
 *         description: "user's role"
 *         required: true
 *     responses:
 *       '200':
 *         description: "Admin get all users (employees)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetALLUsers"
 *       '401':
 *         description: "Verification was unsuccessful"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *       '400':
 *         description: "Enter the date"
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: "You did not enter the date"
 *                 value:
 *                   "error": "enter the role"
 */


// Можливість бачити всіх користувачівб додав вибор по роли щоб можно було і працівників отримувати - адмін
const getAllUsers = async(req,res)=>{
    try {
        if (!req.query.role) res.status(400).json({error:'enter the role'})
        const result = await getAllUsersBd(knex,req.query.role);
        return res.status(200).json({list:result}).end()
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = {
    signUp,
    login,
    createAdmin,
    deletedUser,
    getAllUsers
}