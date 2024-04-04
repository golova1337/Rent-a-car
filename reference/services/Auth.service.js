require("dotenv").config();
const createError = require("http-errors");
const authRepository = require("../db/repository/Auth.repository");
const AuthHelpers = require("../helpers/Auth.helpers");

class AuthService {
  async singUp(body) {
    // helpers
    const hash = await AuthHelpers.hash(body.password);

    // repository
    await authRepository.insert({ ...body, hash: hash });
    return {
      data: {
        name: body.name,
        email: body.email,
      },
      meta: {},
    };
  }

  async login(body) {
    // helpers
    const result = await AuthHelpers.comparePassword(body.password, body.password_hash);
    if (!result) throw createError(400, "Password is not correct");
    const token = await AuthHelpers.createJwt(body.id, body.role);
    return {
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        token: token,
      },
      meta: {},
    };
  }
}

module.exports = new AuthService();
