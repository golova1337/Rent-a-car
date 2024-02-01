const { knex } = require("../db/createConnection");
// const { Auto } = require("../classAuto/СreateAuto");
const { InsertNewAutoBD } = require("../db/InsertNewAutoBD");
const { DeleteAutoBD } = require("../db/deleteAutoBD");
const { FilterCarsBD } = require("../db/FilterCarsBD");
const { IncludeLettersBd } = require("../db/IncludeLettersBd");
const { returnCarBd } = require("../db/returnCarBd");
const { RentalCarsBD } = require("../db/RentalCarsBD");
const { InsertNewRent } = require("../db/Rent/InsertNewRent");
const { GetAllCarsBd } = require("../db/getAllCarsBd");
const { checkUserBeforeRentCar } = require("../db/rent/checkUserCarBeforeRentCar");
// const { getAllUsersBd } = require("../db/getAllUsresBd");

/**
 * @swagger
 * /car/CreateAuto:
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
    const { brand, model, numberPlate, year, price } = req.body;
    // const newAuto =  new Auto(brand,model,number_plate,year,price);
    await InsertNewAutoBD(knex, brand, model, numberPlate, year, price);
    return res.status(201).json({ message: "Car was created" }).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /car/DeleteAuto:
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
const DeleteAuot = async (req, res) => {
  try {
    if (!req.query.number_plate) return res.status(400).json({ message: "enter the machine number" }).end();
    await DeleteAutoBD(knex, req.query.number_plate);
    return res
      .status(200)
      .json({
        message: `Car number_plate = ${req.query.number_plate}  was deleted`,
      })
      .end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }).end();
  }
};

/**
 * @swagger
 * /car/RentalCars:
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
// Можливість бачити які автівки зараз доступні для прокату - користувач і адмін
const RentalCars = async (req, res) => {
  try {
    const result = await RentalCarsBD(knex);
    if (result.length === 0) return res.status(200).json({ message: "There are no machines in rental" });
    return res.status(200).json({ auto: result }).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }).end();
  }
};

/**
 * @swagger
 * /car/FilterCars:
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
const FilterCars = async (req, res) => {
  try {
    const { brand, model, price, year } = req.query;
    if (!brand && !model && !price && !year) return res.status(400).json({ message: "Enter any a data" });

    const result = await FilterCarsBD(knex, req.query);
    if (result.length === 0) {
      return res.status(200).json({ message: "no cars" });
    }
    return res.status(200).json({ auto: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/**
 * @swagger
 * /car/getAllCars:
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
const GetAllCars = async (req, res) => {
  try {
    const result = await GetAllCarsBd(knex);
    return res.status(200).json({ cars: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /car/includeLetters:
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
const includeLetters = async (req, res) => {
  try {
    const result = await IncludeLettersBd(knex, req.query);
    return res.status(200).json({ auto: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /car/rent:
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
 *               email:
 *                 type: string
 *                 example: vasya@gmail.com
 *               brand:
 *                 type: string
 *                 example: audi
 *               model:
 *                 type: string
 *                 example: rs8
 *               year:
 *                 type: integer
 *                 example: 2020
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-07-10T10:30:00
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-08-11T10:30:00
 *     responses:
 *       '200':
 *         description: "Rental successful"
 *         content:
 *           application/json:
 *             example:
 *               message: 'The car has been rented'
 *       '400':
 *         description: "Bad Request, invalid data or email is wrong."
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 summary: Invalid data_1
 *                 value:
 *                   error: "You cannot have two cars in rental"
 *               example2:
 *                 summary: Invalid data_2
 *                 value:
 *                   error: "You already rented a car"
 *               example3:
 *                 summary: Invalid data_3
 *                 value:
 *                   error: "You cannot have two cars in rental"
 *       '401':
 *         description: "Verification was unsuccessful"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 */

// аренда машин
const rent = async (req, res) => {
  const { email, brand, model, year, startTime, endTime } = req.body;
  if (!email || !startTime || !endTime || !brand || !model || !year) return res.status(400).json({ message: "enter the data" });
  if (new Date(startTime) > new Date(endTime))
    return res.status(400).json({
      message: "The start of the lease cannot be after the end of the lease.",
    });

  try {
    const result = await checkUserBeforeRentCar(knex, email);
    req.body.user_id = result;

    await InsertNewRent(knex, req.body);
    return res.status(200).json("you rented").end();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /car/return:
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
 *               number:
 *                 type: string
 *                 example: Ax2212
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-07-10T10:30:00
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
 *                   error: "Enter the data"
 *       '401':
 *         description: "Verification was unsuccessful"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 */

// возврат авто с аренды только админ может делать
const returnCar = async (req, res) => {
  try {
    if (!req.body.numberPlate || !req.body.endTime) return res.status(400).json({ error: "enter the data" });
    await returnCarBd(knex, req.body);
    return res.status(200).json({ error: "The car has been returned" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAuto,
  DeleteAuot,
  RentalCars,
  FilterCars,
  includeLetters,
  GetAllCars,
  returnCar,
  rent,
};
