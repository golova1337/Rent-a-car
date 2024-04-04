require("dotenv").config();
const createError = require("http-errors");
const UserRepository = require("../db/repository/User.repository");
const AuthHelpers = require("../helpers/Auth.helpers");
const paginationCal = require("../utils/paginationCal");

class UserService {
  async singUp(body) {
    const password = body.password;

    // helpers
    const hash = await AuthHelpers.hash(password);

    // repository
    await UserRepository.insert({ ...body, hash: hash });

    // return
    return {
      data: {
        email: body.email,
        name: body.name,
      },
      meta: {},
    };
  }

  async delete(id) {
    // repository
    const result = await UserRepository.delete(id);

    // return
    return {
      data: {
        id: id,
      },
      meta: {},
    };
  }

  async getAll(conditions) {
    let { role, page, perPage } = conditions;
    page = parseInt(page, 10) || 1;
    perPage = parseInt(perPage, 10) || 10;

    // veriable for reposytory
    let data;
    let count;
    // if there is ot role. We make the role = user. repository
    if (!role || !role.trim().length) {
      [data, count] = await UserRepository.getAll({ page, perPage }, "user");
    } else {
      [data, count] = await UserRepository.getAll({ page, perPage }, role);
    }
    // run Calculation pagination
    const pagination = paginationCal({ data, page, perPage, count: count[0].count });

    return pagination;
  }

  async getOne(id) {
    // repository
    const result = await UserRepository.getOne(id);
    if (!result || !Object.keys(result).length) {
      throw createError(404, "User with this id dont exist");
    }
    return {
      data: result,
      meta: {},
    };
  }
}

module.exports = new UserService();
