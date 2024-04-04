require("dotenv").config();
const CarRepository = require("../db/repository/Car.repository");
const createError = require("http-errors");
const obj = require("../utils/obj");
const paginationCal = require("../utils/paginationCal");

class CarService {
  async insert(body) {
    // repository
    await CarRepository.insert(body);
    return {
      data: body,
      meta: {},
    };
  }

  async delete(id) {
    await CarRepository.delete(id);
    return {
      data: {
        id: id,
      },
      meta: {},
    };
  }

  async lease(conditions) {
    let { page, perPage } = conditions;
    page = parseInt(page, 10) || 1;
    perPage = parseInt(perPage, 10) || 10;

    // viriable for repository
    let data;
    let count;

    // repository
    [data, count] = await CarRepository.lease({ page, perPage });

    // pagination
    const pagination = paginationCal({ data, page, perPage, count });

    return pagination;
  }

  async get(conditions) {
    let { page, perPage, ...filters } = conditions;

    // check  there are filters
    filters = obj.notEmpty(filters);
    page = parseInt(page, 10) || 1;
    perPage = parseInt(perPage, 10) || 10;

    // veriable for repository
    let data;
    let count;

    // repository
    if (!Object.keys(filters).length) {
      [data, count] = await CarRepository.get({ page, perPage }, { status: "not_in_rent" });
    } else {
      [data, count] = await CarRepository.get({ page, perPage }, { ...filters, status: "not_in_rent" });
    }

    // calcuate pagination
    const pagination = paginationCal({ data, page, perPage, count });

    return pagination;
  }

  async search(conditions) {
    let { page, perPage, ...substring } = conditions;

    // check substrings
    substring = obj.notEmpty(substring);
    page = parseInt(page, 10) || 1;
    perPage = parseInt(perPage, 10) || 10;

    // veriable for repository
    let data;
    let count;

    // Calling a function depending on the conditions
    if (!Object.keys(substring).length) {
      [data, count] = await CarRepository.get({ page, perPage }, { status: "not_in_rent" });
    } else {
      [data, count] = await CarRepository.search({ page, perPage }, substring);
    }

    // calcuate pagination
    const pagination = paginationCal({ data, page, perPage, count });

    return pagination;
  }

  async rent(body) {
    const id = body.user_id;
    // Check whether the user rents machines or not. return: boolean
    const result = await CarRepository.checkActiveLease(id);
    if (result) {
      throw createError(400, "You  rents a car");
    } else {
      // create new lease
      const idNewLease = await CarRepository.rent(body);
      return {
        data: {
          id: idNewLease,
          start: body.start_time,
          end: body.end_time,
        },
        meta: {},
      };
    }
  }

  async reclaim(id) {
    // Is there a lease
    const resultCheck = await CarRepository.checkLeaseExist(id);
    if (!resultCheck.length) {
      throw createError(404, "Not found");
    } else if (resultCheck[0].status === "inactive") {
      throw createError(400, "The lease is inactive");
    }
    const result = await CarRepository.reclaim({ id, carId: resultCheck[0].car_id });
    return {
      data: {
        result,
      },
      meta: {},
    };
  }
}

module.exports = new CarService();
