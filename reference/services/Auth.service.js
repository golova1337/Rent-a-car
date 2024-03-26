require("dotenv").config();
const createError = require("http-errors");
const authRepository = require("../db/repository/Auth.repository");
const authHelpers = require("../helpers/Auth.helpers");

class AuthService {
  async singUp(body) {
    // helpers
    const hash = await authHelpers.hash(body.password);

    // repository
    await authRepository.insert({ ...body, hash: hash });
    const link = new URL(`http://localhost:${process.env.PORT}/api/v1/login`);
    return {
      message: "Registration successfull",
      data: {
        email: body.email,
        name: body.name,
      },
      meta: {
        link: link,
      },
    };
  }

  async login(body) {
    // helpers
    const result = await authHelpers.comparePassword(body.password, body.password_hash);
    if (!result) throw createError(400, "Password is not correct");
    const token = await authHelpers.createJwt(body.id, body.role);
    return {
      message: "Authentication successfull",
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
