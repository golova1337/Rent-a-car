const { knex } = require("../db/config/createConnection");
const CarService = require("../services/carService/Car.service");
const carService = new CarService(knex);

/**
 * @swagger
 * /cars/creation-car:
 *   post:
 *     summary: "Create new auto (Admin only)"
 *     tags:
 *       - car
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RequestObjectCreateAuto"
 *     responses:
 *       '201':
 *         description: "Auto created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResponseObjectCreateAuto"
 *       '401':
 *         description: "Verification was unsuccessful"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 */
// создания авто с занесением его в таблицу cars доступно только админу
class ControllerCar {
  static async create(req, res) {
    try {
      const body = req.body;
      const result = await carService.insert(body);
      req.body.id = result;
      return res
        .status(201)
        .json({ message: { ...body, id: result } })
        .end();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /cars/:id:
   *   delete:
   *     summary: "Admin can soft delete a car"
   *     description: "When the car is deleted, it remains in the table."
   *     tags:
   *       - car
   *     parameters:
   *       - $ref: "#/components/parameters/DeleteCar"
   *     security:
   *       - JWT: []
   *     responses:
   *       '200':
   *         description: "Car was deleted"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 car:
   *                   type: object
   *       '400':
   *         description: "Bad request"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Enter the machine number"
   *       '401':
   *         description: "Verification was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UnauthorizedError"
   */
  // удаление авто с таблицы cars доступно только админу
  static async delete(req, res) {
    try {
      const id = req.params.id;
      await carService.delete(id);
      return res
        .status(200)
        .json({ message: `Car ${id}  was deleted` })
        .end();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" }).end();
    }
  }

  /**
   * @swagger
   * /cars/lease:
   *   get:
   *     summary: "Admin can view the list of cars currently in rental"
   *     tags:
   *       - car
   *     security:
   *       - JWT: []
   *     responses:
   *       '200':
   *         description: "Admin retrieves a list of all cars currently in rental"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 auto:
   *                   type: array
   *                   items:
   *                     $ref: "#/components/schemas/RequestObjectCreateAuto"
   *       '401':
   *         description: "Verification was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UnauthorizedError"
   */
  // Можливість бачити які автівки зараз в прокату -  адмін
  static async lease(req, res) {
    try {
      const result = await carService.lease();
      return res.status(200).json({ auto: result }).end();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" }).end();
    }
  }

  /**
   * @swagger
   * /:
   *   get:
   *     summary: "Get all cars"
   *     tags:
   *       - car
   *     security:
   *       - JWT: []
   *     responses:
   *       '200':
   *         description: "Get all cars"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/RequestObjectCreateAuto"
   *       '401':
   *         description: "Verification was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UnauthorizedError"
   *       '500':
   *         description: "Filtering unsuccessful"
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: "Internal Server Error"
   *                 value:
   *                   message:'Internal Server Error'
   */
  // Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
  static async get(req, res) {
    try {
      const filters = req.query;
      const result = await carService.get(filters);
      return res.status(200).json({ massage: result });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /cars/search:
   *   get:
   *     summary: "Substring"
   *     description: "The user has the ability to perform a quick search by the name and brand. For example, if the user enters 'su,' it should return all cars where the name or brand contains such a substring (Subaru, Suzuki, Toyota Suburban, etc.), excluding those currently in rental."
   *     tags:
   *       - car
   *     parameters:
   *       - $ref: "#/components/parameters/FilterCarBrand"
   *       - $ref: "#/components/parameters/FilterCarbrandModel"
   *     security:
   *       - JWT: []
   *     responses:
   *       '200':
   *         description: "Search successful"
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - type: object
   *                   properties:
   *                     auto:
   *                       type: array
   *                       items:
   *                         $ref: "#/components/schemas/RequestObjectCreateAuto"
   *       '400':
   *         description: "Filtering unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *               example:
   *                 error: "Enter some data"
   *       '401':
   *         description: "Verification was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UnauthorizedError"
   *       '500':
   *         description: "Filtering unsuccessful"
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: "Internal Server Error"
   *                 value:
   *                   message:'Internal Server Error'
   */
  // Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
  static async search(req, res) {
    try {
      const substring = req.query;
      const result = await carService.search(substring);
      return res.status(200).json({ massage: result });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /cars/lease:
   *   post:
   *     summary: "The user can lease a car."
   *     description: "The user can only have one car on lease at a time. If the car is already rented, the user cannot lease another car."
   *     tags:
   *       - car
   *     security:
   *       - JWT: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             properties:
   *               user_id:
   *                 type: int
   *                 example: 2
   *               car_id:
   *                 type: int
   *                 example: 1
   *               start_time:
   *                 type: string
   *                 format: date-time
   *                 example: 2024-07-10T10:30:00
   *               end_time:
   *                 type: string
   *                 format: date-time
   *                 example: 2024-08-11T10:30:00
   *     responses:
   *       '200':
   *         description: "Rental successful"
   *         content:
   *           application/json:
   *             example:
   *                message: "You have rented successfully."
   *                leaseId: 21
   *       '400':
   *         description: "Bad Request, invalid data or email is wrong."
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: Invalid data_1
   *                 value:
   *                   error: "you are renting"
   *               example2:
   *                 summary: Invalid data_2
   *                 value:
   *                   message: "The start of the lease cannot be after the end of the lease."
   *       '401':
   *         description: "Verification was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UnauthorizedError"
   */

  // аренда машин
  static async rent(req, res) {
    try {
      const body = req.body;
      const result = await carService.rent({ ...body, user_id: req.user.id });
      return res.status(200).json({ message: "You have rented successfully.", leaseId: result }).end();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /cars/reclaim
   *   put:
   *     summary: "Only an admin can process the return of the car."
   *     description: "When a car is returned, update the data in the table regarding its status, indicating whether it is in rental or not. The lease information, along with the actual time finished, is moved to another table, 'Archive_lease,' and is removed from the 'Rentals' table"
   *     tags:
   *       - car
   *     security:
   *       - JWT: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             properties:
   *               leaseId:
   *                 type: int
   *                 example: 2
   *     responses:
   *       '200':
   *         description: "A Return successfully"
   *         content:
   *           application/json:
   *             example:
   *               message: 'The car has been returned'
   *       '400':
   *         description: "Bad Request, invalid data or email is wrong."
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: Invalid data_1
   *                 value:
   *                   error: "Failed to return car: No rental found for this car number"
   *               example2:
   *                 summary: Invalid data_2
   *                 value:
   *                   error: "Enter the lease id"
   *       '401':
   *         description: "Verification was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UnauthorizedError"
   */

  // возврат авто с аренды только админ может делать
  static async reclaim(req, res) {
    try {
      const id = req.params.id;
      await carService.reclaim(id);
      return res.status(200).json({ lease: `${req.params.id} is finished` });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ControllerCar;
