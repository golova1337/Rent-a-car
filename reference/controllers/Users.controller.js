const UserService = require("../services/User.service");
const Responses = require("../utils/response");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ReqSignUp:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 32
 *           minLength: 4
 *           example: "Lady"
 *         lastname:
 *           type: string
 *           maxLength: 32
 *           minLength: 4
 *           example: "Marian"
 *         email:
 *           type: string
 *           format: email
 *           example: "ladymarian@gmail.com"
 *         password:
 *           type: string
 *           maxLength: 32
 *           minLength: 10
 *           example: "lady123456789"
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 *           example: admin
 *
 *     ResSignUp:
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
 *               example: ladymarian@gmail.com
 *             name:
 *               example: Lady
 *         error:
 *           example: null
 *
 *     DeletionResponseUsers:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Deletion successful"
 *         error:
 *           type: null
 *           example: null
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 2
 *
 *     GetAllUsers:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Getting all users successful"
 *         total:
 *           type: object
 *           properties:
 *             per_page:
 *               type: integer
 *               example: 10
 *             current_page:
 *               type: integer
 *               example: 1
 *             last_page:
 *               type: integer
 *               example: 3
 *             from:
 *               type: integer
 *               example: 1
 *             to:
 *               type: integer
 *               example: 10
 *         error:
 *           type: null
 *           example: null
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 4
 *               name:
 *                 type: string
 *                 example: "kseniya"
 *               lastname:
 *                 type: string
 *                 example: "shkoda"
 *               email:
 *                 type: string
 *                 example: "kseniya1993@gmail.com"
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - user
 *                 example: "user"
 *           example:
 *             - id: 2
 *               name: "Patrick"
 *               lastname: "Star"
 *               email: "patrickstar@gmail.com"
 *               role: "user"
 *             - id: 3
 *               name: "Fiona"
 *               lastname: "Princess"
 *               email: "fionaprincess@gmail.com"
 *               role: "user"
 *             - id: 4
 *               name: "Mickey"
 *               lastname: "Mouse"
 *               email: "mickeymouse@gmail.com"
 *               role: "user"
 *
 *     SingleUserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Getting one user by ID successful"
 *         total:
 *           type: object
 *           example: {}
 *         error:
 *           type: null
 *           example: null
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             name:
 *               type: string
 *               example: "Patrick"
 *             lastname:
 *               type: string
 *               example: "Star"
 *             email:
 *               type: string
 *               example: "patrickstar@gmail.com"
 *             role:
 *               type: string
 *               enum:
 *                 - admin
 *                 - user
 *               example: "admin"
 *           example:
 *             id: 2
 *             name: "Patrick"
 *             lastname: "Star"
 *             email: "patrickstar@gmail.com"
 *             role: "user"
 *
 *     UserNotFoundResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "User with this id dont exist"
 *         data:
 *           type: null
 *           example: null
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "User with this id dont exist"
 *           example:
 *             message: "User with this id dont exist"
 */
class UsersController {
  /**
   * @swagger
   * /api/v1/users:
   *   post:
   *     tags:
   *       - user
   *     security:
   *       - bearerAuth: []
   *     summary: Creating an administrator or user only by super admin
   *     description: |
   *       Using this data:
   *         - email: bobSponge@gmail.com
   *         - password: bob123456789
   *       Execute login by routing: /api/v1/authlogin
   *       Use the obtained token to work with endpoints which are for admin and super admin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ReqSignUp"
   *     responses:
   *       '201':
   *         description: Admin created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ResSignUp"
   *       '400':
   *         description: Bad Request, invalid value. Please review the property values.
   *         content:
   *           application/json:
   *             examples:
   *               BadRequest:
   *                 summary: email exist
   *                 value:
   *                   error : BadRequest
   *               Invalid value:
   *                 summary: Invalid value
   *                 value:
   *                   error : Invalid value
   *       '401':
   *         description: No jwt token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: verefication was unsuccessful.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *          description: server error.
   *          content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  // Створення адмінів - суперадміном (повинен бути присутнім в єдиному екзмеплярі)
  async create(req, res, next) {
    // data for run the service
    const body = req.body;
    try {
      // the service
      const result = await UserService.singUp(body);

      // create response
      const { data, meta } = result;
      const response = Responses.successResponse({ message: "Registration successful", data, meta });

      // response
      return res.status(201).json(response).end();
    } catch (error) {
      // if there is a custom error
      if (error.status) {
        const response = Responses.errorResponse(error);
        res.status(error.status).json(response);
      } else {
        // 500 error
        next(error);
      }
    }
  }

  /**
   * @swagger
   * /api/v1/users/{userId}:
   *   delete:
   *     summary: "Administrator and super administrator can delete a user"
   *     tags:
   *       - user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: userId
   *         in: path
   *         description: "user's id"
   *         required: true
   *         schema:
   *           type: integer
   *           example: 2
   *     responses:
   *       '200':
   *         description: User was deleted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeletionResponseUsers"
   *       '401':
   *         description: No jwt token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: verefication was unsuccessful.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: server error.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  // Видалення користувачів (Soft Delete) - адмін
  async delete(req, res, next) {
    // data for run the service
    const id = req.params.id;
    try {
      // the sertvice
      const result = await UserService.delete(id);

      // create response
      const { data, meta } = result;
      const response = Responses.successResponse({ message: "Deletion successful", data, meta });

      // response
      return res.status(200).json(Responses.successResponse(response));
    } catch (error) {
      if (error.status) {
        const response = Responses.errorResponse(error);
        res.status(error.status).json(response);
      } else {
        next(error);
      }
    }
  }

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: "Get all users by role only admin, superadmin"
   *     tags:
   *       - user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: role
   *         in: query
   *         description: "user's role"
   *         example: user
   *       - name: page
   *         in: query
   *         description: "user's role"
   *         type: integer
   *         example: 1
   *       - name: perPage
   *         in: query
   *         description: "user's role"
   *         type: integer
   *         example: 10
   *     responses:
   *       '200':
   *         description: "Admin get all users (employees)"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAllUsers"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: verefication was unsuccessful.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: server error.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */

  // Можливість бачити всіх користувачівб додав вибор по роли щоб можно було і працівників отримувати - адмін,cуперадмін
  async getAll(req, res, next) {
    // data for run the service
    const query = req.query;

    try {
      // the service
      const result = await UserService.getAll(query);

      // create response
      const { data, ...meta } = result;
      const response = Responses.successResponse({ message: "Getting all users successful", data, meta });

      // response
      return res.status(200).json(response).end();
    } catch (error) {
      // if there is a custom error
      if (error.status) {
        const response = Responses.errorResponse(error);
        res.status(error.status).json(response);
      } else {
        // 500 error
        next(error);
      }
    }
  }

  /**
   * @swagger
   * /api/v1/users/{userId}:
   *   get:
   *     summary: "Get all user by role only admin, superadmin"
   *     tags:
   *       - user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: userId
   *         in: path
   *         description: "user's id"
   *         example: 2
   *         required: true
   *     responses:
   *       '200':
   *         description: "Admin get  user (employees)"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/SingleUserResponse"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '404':
   *         description: "User with this id dont exist"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserNotFoundResponse"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '500':
   *         description: server error.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  // Можливість бачити користовича по ID  - адмін, cуперадмін
  async getOne(req, res, next) {
    // data for run the service
    const id = req.params.id;

    try {
      // the service
      const result = await UserService.getOne(id);

      // create response
      const { data, meta } = result;
      const response = Responses.successResponse({ message: "Getting one user by ID successful", data, meta });

      // response
      return res.status(200).json(response).end();
    } catch (error) {
      // if there is a custom error
      if (error.status) {
        const response = Responses.errorResponse(error);
        res.status(error.status).json(response);
      } else {
        // 500 error
        next(error);
      }
    }
  }
}
module.exports = new UsersController();
