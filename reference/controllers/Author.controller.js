const AuthorService = require("../services/Author.service");

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
class AuthorController {
  constructor(authorService) {
    this.authorService = authorService;
  }

  // регестрація юзера та занесення його в бд БЕЗ видачі JWT
  /**
   * @swagger
   * /:
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
   *               message: "was created."
   *               id: "id"
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
   *                   error: "User with this email already exists"
   *       '500':
   *         description: User already exists.
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: User already exists
   *                 value:
   *                   error: "User with this email already exists"
   */
  async signUp(req, res) {
    try {
      const body = req.body;
      await this.authorService.singUp({ ...body, role: "user" });
      return res.status(201).json({ message: "user was created" }).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
   *               id: "id"
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
  // вхід та видача JWT с  ролью юзера
  async login(req, res) {
    try {
      const user = req.user;
      const body = req.body;
      const token = await this.authorService.login({ ...body, ...user });
      return res.status(200).json({ token: token }).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new AuthorController(AuthorService);
