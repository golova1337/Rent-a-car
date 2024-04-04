const AuthService = require("../services/Auth.service");
const Responses = require("../utils/response");

/**
 * @swagger
 * components:
 *   errors:
 *     ServerError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Internal Server Error"
 *     Forbidden:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Forbidden"
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Unauthorized"
 *     BadRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Indicates if the request was successful or not.
 *         message:
 *           type: string
 *           description: A message describing the error.
 *         data:
 *           type: null
 *           description: Null value as there's no data associated with the error.
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: A detailed message about the error.
 *       example:
 *         status: false
 *         message: "Password is not correct"
 *         data: null
 *         error:
 *           message: "Password is not correct"
 *   schemas:
 *     ReqSignUpUser:
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
 *           example: "robinhoodn@gmail.com"
 *         password:
 *           type: string
 *           maxLength: 32
 *           minLength: 10
 *           example: "robin12345"
 * 
 *     ResSignUpUser:
 *       type: object
 *       properties:
 *         status:
 *           example: true
 *         message:
 *           example: Registration successfull
 *         total:
 *           type: object
 *           properties:
 *             meta:
 *               type: object  
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
 *           example: robinhoodn@gmail.com
 *         password:
 *           type: string
 *           maxLength: 32
 *           minLength: 10
 *           example: "robin12345"
 *     ResLogin:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "login successfull"
 *         total:
 *           type: object
 *           properties:
 *             meta:
 *               type: object
 *               example: {}
 *         error:
 *           type: null
 *           example: null
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: robinhoodn@gmail.com
 *             name:
 *               type: string
 *               example: robin
 *             role:
 *               type: string
 *               example: "user"
 *             token:
 *               type: string
 *               example: jwt token
 */

class AuthorController {
  // регестрація юзера та занесення його в бд БЕЗ видачі JWT
  /**
   * @swagger
   * /api/v1/auth/signup:
   *   post:
   *     summary: "Registration a new user"
   *     tags:
   *       - authorization
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ReqSignUpUser"
   *     responses:
   *       '201':
   *         description: registration successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ResSignUpUser"
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
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  async signUp(req, res, next) {
    // data for run the service
    const body = req.body;
    try {
      // the service
      const result = await AuthService.singUp({ ...body, role: "user" });

      // create response
      const { data, ...meta } = result;
      const response = Responses.successResponse({ message: "create successfull", data, meta });

      // response
      return res.status(201).json(response);
    } catch (error) {
      if (error.status) {
        const response = Responses.errorResponse(error);
        return res.status(error.status).json(response);
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/auth/login:
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
   *             schema:
   *               $ref: "#/components/errors/BadRequest"
   *       '500':
   *         description: server error.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  // вхід та видача JWT с  ролью юзера,next
  async login(req, res, next) {
    // data for run the srvice
    const user = req.user;
    const body = req.body;
    try {
      // the service
      const result = await AuthService.login({ ...body, ...user });

      // create response
      const { data, ...meta } = result;
      const response = Responses.successResponse({ message: "login successfull", data, meta });

      // response
      return res.status(200).json(response).end();
    } catch (error) {
      if (error.status) {
        const response = Responses.errorResponse(error);
        return res.status(error.status).json(response);
      }
      next(error);
    }
  }
}
module.exports = new AuthorController();
