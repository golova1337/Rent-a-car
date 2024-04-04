const CarService = require("../services/Car.service");
const Response = require("../utils/response");

/**
 * @swagger
 * components:
 *   schemas:
 *     GetAllCars:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Getting all cars successful"
 *         total:
 *           type: object
 *           properties:
 *             per_page:
 *               type: integer
 *               example: 5
 *             current_page:
 *               type: integer
 *               example: 1
 *             last_page:
 *               type: integer
 *               example: 1
 *             from:
 *               type: integer
 *               example: 1
 *             to:
 *               type: integer
 *               example: 1
 *         error:
 *           type: null
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 2
 *               brand:
 *                 type: string
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 example: "Corolla"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               number_plate:
 *                 type: string
 *                 example: "BX2234"
 *               price:
 *                 type: integer
 *                 example: 1500
 *               status:
 *                 type: string
 *                 description: "Status of the car."
 *                 example: "not_in_rent"
 *
 *     CarCreateRequest:
 *       type: object
 *       properties:
 *         brand:
 *           type: string
 *           description: "Brand of the car."
 *           example: "BMW"
 *         model:
 *           type: string
 *           description: "Model of the car."
 *           example: "m5"
 *         year:
 *           type: integer
 *           description: "Year of the car."
 *           example: 2020
 *         number_plate:
 *           type: string
 *           description: "License plate number of the car."
 *           example: "AX1337"
 *         price:
 *           type: integer
 *           description: "Price of the car."
 *           example: 1700
 *
 *     CarCreationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "create successfull"
 *         total:
 *           type: object
 *           example: {}
 *         error:
 *           type: null
 *         data:
 *           type: object
 *           properties:
 *             brand:
 *               type: string
 *               example: "BMW"
 *             model:
 *               type: string
 *               example: "m5"
 *             year:
 *               type: integer
 *               example: 2020
 *             number_plate:
 *               type: string
 *               example: "AX1337"
 *             price:
 *               type: integer
 *               example: 1700
 *
 *     DeletionResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Deletion successful"
 *         total:
 *           type: object
 *           example: {}
 *         error:
 *           type: null
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "4"
 *
 *     LeaseReceiptResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Receipt of leased vehicles successfully"
 *         total:
 *           type: object
 *           properties:
 *             per_page:
 *               type: integer
 *               example: 5
 *             current_page:
 *               type: integer
 *               example: 1
 *             last_page:
 *               type: integer
 *               example: 1
 *             from:
 *               type: integer
 *               example: 1
 *             to:
 *               type: integer
 *               example: 1
 *         error:
 *           type: null
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               brand:
 *                 type: string
 *                 example: "Honda"
 *               model:
 *                 type: string
 *                 example: "Civic"
 *               year:
 *                 type: integer
 *                 example: 2019
 *               number_plate:
 *                 type: string
 *                 example: "EX5678"
 *               price:
 *                 type: integer
 *                 example: 1400
 *               status:
 *                 type: string
 *                 example: "in_rent"
 *
 *     SearchResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Searching successfull"
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
 *               example: 1
 *             from:
 *               type: integer
 *               example: 1
 *             to:
 *               type: integer
 *               example: 2
 *         error:
 *           type: null
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               brand:
 *                 type: string
 *                 example: "Mercedes-Benz"
 *               model:
 *                 type: string
 *                 example: "E-Class"
 *               year:
 *                 type: integer
 *                 example: 2015
 *               number_plate:
 *                 type: string
 *                 example: "CX3456"
 *               price:
 *                 type: integer
 *                 example: 1800
 *               status:
 *                 type: string
 *                 example: "not_in_rent"
 *
 *     LeaseResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "The lease is successful"
 *         total:
 *           type: object
 *           properties:
 *             meta:
 *               type: object
 *         error:
 *           type: null
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 4
 *             start:
 *               type: string
 *               format: date-time
 *               example: "2025-07-10T10:30:00"
 *             end:
 *               type: string
 *               format: date-time
 *               example: "2025-08-11T10:30:00"
 *
 *     ReclaimResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Reclaim successful"
 *         total:
 *           type: object
 *           properties:
 *             meta:
 *               type: object
 *         error:
 *           type: null
 *         data:
 *           type: object
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Unauthorized"
 */
class CarsController {
  /**
   * @swagger
   * /api/v1/cars:
   *   get:
   *     summary: "Get all cars"
   *     description: If there's no filtering, you get all the cars
   *     tags:
   *       - car
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: brand
   *         schema:
   *           type: string
   *         example: Toyota
   *       - in: query
   *         name: model
   *         schema:
   *           type: string
   *         example: Corolla
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: perPage
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         example: 10
   *     responses:
   *       '200':
   *         description: "Successful operation"
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/GetAllCars"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: "Internal Server Error"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */

  // Можливість бачити які автівки зараз доступні для прокату - користувач і адмін.
  async get(req, res, next) {
    // data for run the service
    const query = req.query;
    try {
      // the service
      const result = await CarService.get(query);

      // create response
      const { data, ...meta } = result;
      const response = Response.successResponse({ message: "Getting all cars successful ", data, meta });

      // response
      return res.status(200).json(response);
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
   * /api/v1/cars:
   *   post:
   *     summary: "Create new auto - admin, superadmin"
   *     tags:
   *       - car
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CarCreateRequest"
   *     responses:
   *       '201':
   *         description: "Auto created successfully"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/CarCreationResponse"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
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
  // создания авто с занесением его в таблицу cars доступно только админу

  async create(req, res, next) {
    // data for run the srvice
    const body = req.body;
    try {
      // the service
      const result = await CarService.insert(body);

      // create response
      const { data, meta } = result;
      const response = Response.successResponse({
        message: "create successfull",
        data,
        meta,
      });

      // response
      return res.status(201).json(response);
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
   * /api/v1/cars/{carId}:
   *   delete:
   *     summary: "Admin, superadmin can soft delete a car"
   *     description: "When the car is deleted, it remains in the table. (soft deletion)"
   *     tags:
   *       - car
   *     parameters:
   *       - name: carId
   *         in: path
   *         description: "Identifier car"
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           format: int64
   *         example: 4
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: "Car was deleted"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeletionResponse"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: "Server error."
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */

  // удаление авто с таблицы cars доступно только админу
  async delete(req, res, next) {
    // data for run the srvice
    const id = req.params.id;
    try {
      // the service
      const result = await CarService.delete(id);

      // create response
      const { data, meta } = result;
      const response = Response.successResponse({ message: "Deletion successful", data, meta });

      // response
      return res.status(200).json(response);
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
   * /api/v1/cars/lease:
   *   get:
   *     summary: "Admin can view the list of cars currently in rental"
   *     tags:
   *       - car
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: perPage
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         example: 5
   *     responses:
   *       '200':
   *         description: "Admin retrieves a list of all cars currently in rental"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LeaseReceiptResponse"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: "Server error."
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  // Можливість бачити які автівки зараз в прокату -  адмін
  async lease(req, res, next) {
    // data for run the service
    const query = req.query;
    try {
      // the service
      const result = await CarService.lease(query);

      // create response
      const { data, ...meta } = result;
      const response = Response.successResponse({ message: "Receipt of leased vehicles successfully", data, meta });

      // response
      return res.status(200).json(response);
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
   * api/v1/cars/search:
   *   get:
   *     summary: "Substring"
   *     description: "Search by substring"
   *     tags:
   *       - car
   *     parameters:
   *       - in: query
   *         name: brand
   *         schema:
   *           type: string
   *         example: er
   *       - in: query
   *         name: model
   *         schema:
   *           type: string
   *         example: ass
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: "Search successful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/SearchResponse"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: "Filtering unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  // Користувач повинен мати можливість швидкого пошуку по назві і марці авто.
  async search(req, res, next) {
    // data for run the service
    const query = req.query;
    try {
      // the service
      const result = await CarService.search(query);

      // create response
      const { data, ...meta } = result;
      const response = Response.successResponse({ message: "Searching successfull", data, meta });

      // response
      return res.status(200).json(response);
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
   * /api/v1/cars/lease:
   *   post:
   *     summary: "The user or admin can lease a car."
   *     description: "The user can only have one car on lease at a time. If the car is already rented, the user cannot lease another car."
   *     tags:
   *       - car
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             properties:
   *               car_id:
   *                 type: integer
   *                 example: 2
   *               start_time:
   *                 type: string
   *                 format: date-time
   *                 example: "2025-07-10T10:30:00"
   *               end_time:
   *                 type: string
   *                 format: date-time
   *                 example: "2025-08-11T10:30:00"
   *     responses:
   *       '200':
   *         description: "Rental successful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LeaseResponse"
   *       '400':
   *         description: "Bad Request, invalid data or email is wrong."
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: "You rents a car"
   *                 value:
   *                   status: false
   *                   message: "You rents a car"
   *                   data: null
   *                   error:
   *                     message: "You rents a car"
   *               example2:
   *                 summary: "Invalid data"
   *                 value:
   *                   "Invalid value": "car_id"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: "Server error."
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */

  // аренда машин
  async rent(req, res, next) {
    // data for run the service
    const body = req.body;
    const user_id = req.user.id;
    try {
      // the service
      const result = await CarService.rent({ ...body, user_id });

      // create response
      const { data, ...meta } = result;
      const response = Response.successResponse({ message: "The lease is successful", data, meta });

      // response
      return res.status(200).json(response);
    } catch (error) {
      if (error.status) {
        res.status(error.status).json(Response.errorResponse(error));
      } else {
        next(error);
      }
    }
  }

  // возврат авто с аренды только админ может делать
  /**
   * @swagger
   * /api/v1/cars/reclaim/{leaseId}:
   *   put:
   *     summary: "The admin or super admin returns the rent"
   *     tags:
   *       - car
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: leaseId
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *     responses:
   *       '200':
   *         description: "Admin retrieves a list of all cars currently in rental"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ReclaimResponse"
   *       '400':
   *         description: "The lease is inactive"
   *         content:
   *           application/json:
   *             examples:
   *               example1:
   *                 summary: "The lease is inactive"
   *                 value:
   *                   status: false
   *                   message: "The lease is inactive"
   *                   data: null
   *                   error:
   *                     message: "The lease is inactive"
   *       '401':
   *         description: "No jwt token"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/UnauthorizedError"
   *       '403':
   *         description: "verefication was unsuccessful"
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/Forbidden"
   *       '500':
   *         description: "Server error."
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/errors/ServerError"
   */
  async reclaim(req, res, next) {
    const id = req.params.id;
    try {
      // the service
      const result = await CarService.reclaim(id);

      // create response
      const { data, ...meta } = result;
      const response = Response.successResponse({ message: "Reclaim successful", data, meta });

      // response
      return res.status(200).json(response);
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
