const AuthService = require("../services/Auth.service");
const Responses = require("../utils/response");

/**
 * @swagger
 * components:
 *   schemas:
 *     ReqSignUp:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 32
 *           minLength: 4
 *           example: "Robin"
 *         lastname:
 *           type: string
 *           maxLength: 32
 *           minLength: 4
 *           example: "Hood"
 *         email:
 *           type: string
 *           format: email
 *           example: "vasyapupkin@gmail.com"
 *         password:
 *           type: string
 *           maxLength: 32
 *           minLength: 10
 *           example: "qwerty12345"
 * 
 *     ResSignUp:
 *       type: object
 *       properties:
 *         status:
 *           example: true
 *         message:
 *           example: Registration successfull
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               example: robinhood@gmail.com
 *             name:
 *               example: robin
 *         error:
 *           example: null

 *     ReqLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "vasyapupkin@gmail.com"
 *         password:
 *           type: string
 *           maxLength: 32
 *           minLength: 10
 *           example: "qwerty12345"
 *     ResLogin:
 *       type: object
 *       properties:
 *         status: true
 *         example: Authentication successfull
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: robinhood.com
 *             name:
 *               type: string
 *               example: robin
 *             role:
 *               type: string
 *               example: user
 *         error:
 *           example: null
 */

class AuthorController {
  // регестрація юзера та занесення його в бд БЕЗ видачі JWT
  /**
   * @swagger
   * /:
   *   post:
   *     summary: "Registration a new user"
   *     tags:
   *       - authorization
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ReqSignUp"
   *     responses:
   *       '201':
   *         description: registration successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ResSignUp"
   *       '400':
   *         description: Bad Request, invalid data. Please review the property values.
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: Invalid data
   *                 value:
   *                   error: "Invalid value"
   *               example2:
   *                 summary: User already exists
   *                 value:
   *                   error: "BadRequest"
   *       '500':
   *         description: server error.
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: Problems on the server
   *                 value:
   *                   error: "Internal Server Error"
   */
  async signUp(req, res, next) {
    // data for run the service
    const body = req.body;
    try {
      // the service
      const { message, data, meta } = await AuthService.singUp({ ...body, role: "user" });

      // response
      return res.status(201).json(Responses.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json(Responses.errorResponse(error));
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login a user and obtain a JSON Web Token (JWT)
   *     tags:
   *       - authorization
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ReqLogin"
   *     responses:
   *       '200':
   *         description: User login successfully
   *         content:
   *           application/json:
   *             schema:
   *              $ref: "#/components/schemas/ResLogin"
   *       '400':
   *         description: Bad Request, invalid data or email is wrong.
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: Invalid data
   *                 value:
   *                   error: "Invalid data"
   *               example2:
   *                 summary: User does not exist
   *                 value:
   *                   error: "BadRequest"
   *       '500':
   *         description: server error.
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: Problems on the server
   *                 value:
   *                   error: "Internal Server Error"
   */
  // вхід та видача JWT с  ролью юзера,next
  async login(req, res, next) {
    // data for run the srvice
    const user = req.user;
    const body = req.body;
    try {
      // the service
      const { message, data, meta } = await AuthService.login({ ...body, ...user });

      // response
      return res.status(200).json(Responses.successResponse({ message, data, meta })).end();
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json(Responses.errorResponse(error));
      }
      next(error);
    }
  }
}
module.exports = new AuthorController();
