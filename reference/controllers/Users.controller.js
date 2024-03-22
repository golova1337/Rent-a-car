const UserService = require("../services/User.service");

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
class UsersController {
  /**
   * @swagger
   * /creation:
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
  async create(req, res, next) {
    const body = req.body;
    try {
      await UserService.singUp({ ...body, role: "admin" });
      return res.status(201).json({ message: "admin was created" }).end();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /:id:
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
  // Видалення користувачів (Soft Delete) - адмін
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await UserService.delete(id);
      return res.status(200).json({ message: "was deleted" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /all-users:
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
  async getAll(req, res, next) {
    try {
      const role = req.query.role;
      const result = await UserService.getAll(role);
      return res.status(200).json({ list: result }).end();
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UsersController();
