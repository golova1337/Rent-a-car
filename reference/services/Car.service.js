require("dotenv").config();
const CarRepository = require("../db/repository/Car.repository");
const createError = require("http-errors");
const obj = require("../utils/obj");
const pagination = require("../utils/pagination");

class CarService {
  async insert(body) {
    // repository
    await CarRepository.insert(body);
    return {
      message: "create successfull",
      data: body,
      meta: {},
    };
  }

  async delete(id) {
    await CarRepository.delete(id);
    return {
      message: "deletion successfull",
      data: {
        id: id,
      },
      meta: {},
    };
  }

  async lease(page, perPage) {
    // repository
    let result = await CarRepository.lease();

    // pagination
    const { paginatedResult, totalPages } = pagination(page, perPage, result);

    return {
      message: "Get successful",
      meta: {
        current_page: page,
        per_page: perPage,
        total_items: result.length,
        total_pages: totalPages,
        prev_page: page > 1 ? page - 1 : null,
        next_page: page < totalPages ? page + 1 : null,
      },
      data: {
        result: paginatedResult,
      },
    };
  }

  async get(filters, page, perPage) {
    // check  there are filters
    const data = obj.notEmpty(filters);
    let result;

    // repository
    if (!Object.keys(data).length) {
      result = await CarRepository.get({ status: "not_in_rent" });
    } else {
      result = await CarRepository.get({ ...data, status: "not_in_rent" });
    }
    const { paginatedResult, totalPages } = pagination(page, perPage, result);

    return {
      message: "Get successful",
      meta: {
        current_page: page,
        per_page: perPage,
        total_items: result.length,
        total_pages: totalPages,
        prev_page: page > 1 ? page - 1 : null,
        next_page: page < totalPages ? page + 1 : null,
      },
      data: {
        result: paginatedResult,
      },
    };
  }

  async search(substring, page, perPage) {
    const data = obj.notEmpty(substring);
    let result;
    if (!Object.keys(data).length) {
      result = await CarRepository.get({ status: "not_in_rent" });
    } else {
      result = await CarRepository.search(data);
    }

    // pagination
    const { paginatedResult, totalPages } = pagination(page, perPage, result);
    return {
      message: "Get successful",
      meta: {
        current_page: page,
        per_page: perPage,
        total_items: result.length,
        total_pages: totalPages,
        prev_page: page > 1 ? page - 1 : null,
        next_page: page < totalPages ? page + 1 : null,
      },
      data: {
        result: paginatedResult,
      },
    };
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
        message: "The lease is successful",
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
    // create end of lease
    const end = new Date();
    // Is there a lease
    const resultCheck = await CarRepository.checkLeaseExist(id);
    if (!resultCheck.length) {
      throw createError(404, "Not found");
    }
    const result = await CarRepository.reclaim({ id, end, carId: resultCheck[0].car_id });
    return {
      message: "Reclaim successful",
      data: {
        result,
      },
      meta: {},
    };
  }
}

module.exports = new CarService();
