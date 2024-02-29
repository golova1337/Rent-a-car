const { knex } = require("../db/config/createConnection");
const CarsModel = require("../models/modelCar/ModelCar");
const dbCars = new CarsModel(knex);

/**
 * @swagger
 * /car/admin/creation-car:
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
const createAuto = async (req, res) => {
  try {
    const result = await dbCars.insertNewCarDB(req.body);
    req.body.id = result;
    return res.status(201).json({ message: req.body }).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /car/admin/:id:
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
const deleteAuot = async (req, res) => {
  try {
    await dbCars.deleteCarFromDB(req.params.id);
    return res
      .status(200)
      .json({ message: `Car ${req.params.id}  was deleted` })
      .end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }).end();
  }
};

/**
 * @swagger
 * /car/admin/lease:
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
const getCarsAreBeingRented = async (req, res) => {
  try {
    const result = await dbCars.getCarsIsBeingRentedDB();
    return res.status(200).json({ auto: result }).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }).end();
  }
};

/**
 * @swagger
 * /car/filtration:
 *   get:
 *     summary: "Both an admin and a user can filter cars based on brand, model, price, year, or any combination of these criteria, excluding those currently in rental."
 *     tags:
 *       - car
 *     parameters:
 *       - $ref: "#/components/parameters/FilterCarBrand"
 *       - $ref: "#/components/parameters/FilterCarbrandModel"
 *       - $ref: "#/components/parameters/FilterCarbrandYear"
 *       - $ref: "#/components/parameters/FilterCarbrandPrice"
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
 *                         $ref: "#/components/schemas/FilterAuto"
 *       '500':
 *         description: "Filtering unsuccessful"
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: "Internal Server Error"
 *                 value:
 *                   "error": "Internal Server Error"
 *
 *       '401':
 *         description: "Verification was unsuccessful"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 */
// фільтрувати автівки що доступні по всім полям які є у автівки (наприклад brand, model, year etc)
const getFilteredCars = async (req, res) => {
  try {
    const result = await dbCars.filterCarsDb(req.query);
    if (result.length === 0) return res.status(200).json({ message: "no cars" }).end();
    return res.status(200).json({ auto: result }).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }).end();
  }
};
/**
 * @swagger
 * /car//all-cars:
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
const getAllCars = async (req, res) => {
  try {
    const result = await dbCars.getAllCarsDb();
    return res.status(200).json({ massage: result });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /car/search:
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
const getSearchCars = async (req, res) => {
  try {
    const result = await dbCars.searchCarsDb(req.query);
    return res.status(200).json({ auto: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /car/lease:
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
const rentCar = async (req, res) => {
  try {
    const result = await dbCars.rentCarDb(req.body);
    return res.status(200).json({ message: "You have rented successfully.", leaseId: result }).end();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /car/admin/:
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
const reclaimCar = async (req, res) => {
  try {
    await dbCars.reclaimCarDb(req.body.id);
    return res.status(200).json({ lease: `${req.body.id} is finished` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAuto,
  deleteAuot,
  getCarsAreBeingRented,
  getFilteredCars,
  getSearchCars,
  getAllCars,
  reclaimCar,
  rentCar,
};
