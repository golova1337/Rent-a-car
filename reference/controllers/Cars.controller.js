const CarService = require("../services/Car.service");
const Response = require("../utils/response");

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
class CarsController {
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
  async get(req, res, next) {
    // data for run the service
    const filters = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    try {
      // the service
      const { message, data, meta } = await CarService.get(filters, page, perPage);
      // response
      return res.status(200).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
    }
  }

  async create(req, res, next) {
    // data for run the srvice
    const body = req.body;
    try {
      // the service
      const { message, data, meta } = await CarService.insert(body);

      // response
      return res.status(201).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
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
  async delete(req, res, next) {
    // data for run the srvice
    const id = req.params.id;
    try {
      // the service
      const { message, data, meta } = await CarService.delete(id);

      // response
      return res.status(200).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
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
  async lease(req, res, next) {
    // data for run the service
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    try {
      // the service
      const { message, data, meta } = await CarService.lease(page, perPage);

      // response
      return res.status(200).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
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
  async search(req, res, next) {
    // data for run the service
    const substring = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    try {
      // the service
      const { message, data, meta } = await CarService.search(substring, page, perPage);

      // response
      return res.status(200).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
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
  async rent(req, res, next) {
    // data for run the service
    const body = req.body;
    const user_id = req.user.id;
    try {
      // the service
      const { message, data, meta } = await CarService.rent({ ...body, user_id });

      // response
      return res.status(200).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
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
  async reclaim(req, res, next) {
    const id = req.params.id;
    try {
      // the service
      const { message, data, meta } = await CarService.reclaim(id);

      // response
      return res.status(200).json(Response.successResponse({ message, data, meta }));
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
    }
  }
}

module.exports = new CarsController();
