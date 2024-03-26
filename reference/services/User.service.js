require("dotenv").config();
const createError = require("http-errors");
const UserRepository = require("../db/repository/User.repository");
const authHelpers = require("../helpers/Auth.helpers");
const pagination = require("../utils/pagination");

class UserService {
  async singUp(body) {
    const password = body.password;

    // helpers
    const hash = await authHelpers.hash(password);

    // repository
    await UserRepository.insert({ ...body, hash: hash });

    // Link to login
    const link = new URL(`http://localhost${process.env.PORT}/api/v1/auth/login`);

    return {
      message: "Registration successful",
      data: {
        email: body.email,
        name: body.name,
      },
      meta: {
        link: link,
      },
    };
  }

  async delete(id) {
    const date = new Date();

    // repository
    await UserRepository.delete(id, date);

    // Link to check if the user exists
    const link = new URL(`http://localhost:${process.env.PORT}/api/v1/users/${id}`);
    return {
      message: "Deletion successful",
      data: {
        id: id,
        deleted_at: date,
      },
      meta: {
        link: link,
      },
    };
  }

  async getAll(data) {
    const { role, page, perPage } = data;

    let result;

    // if there is ot role. We make the role = user. repository
    if (!role || !role.trim().length) {
      result = await UserRepository.getAll("user");
    } else {
      result = await UserRepository.getAll(role);
    }

    // result pagination
    const { paginatedResult, totalPages } = pagination(page, perPage, result);

    // create link next page and prev page
    const linkNext = new URL(`http://localhost:${process.env.PORT}/api/v1/users?page=${page < totalPages ? page + 1 : null}&perPage=${perPage}`);
    const linkPrev = new URL(`http://localhost:${process.env.PORT}/api/v1/users?page=${page > 1 ? page - 1 : null}&perPage=${perPage}`);

    return {
      message: "Get successful",
      meta: {
        current_page: page,
        per_page: perPage,
        total_items: result.length,
        total_pages: totalPages,
        prev_page: page > 1 ? page - 1 : null,
        next_page: page < totalPages ? page + 1 : null,
        link_next: linkNext,
        link_prev: linkPrev,
      },
      data: {
        result: paginatedResult,
      },
    };
  }

  async getOne(id) {
    // repository
    const result = await UserRepository.getOne(id);
    if (!result || !Object.keys(result).length) {
      throw createError(404, "User with this id dont exist");
    }
    return {
      message: "getOne successful",
      data: result,
      meta: {},
    };
  }
}

module.exports = new UserService();
