const authRepository = require("../db/repository/Auth.repository");
const { comparePassword, hashingPassword } = require("../helpers/auth/password");
const jwtHelper = require("../helpers/jwt/jwt.helper");

class AuthService {
  async singUp(body) {
    const hash = await hashingPassword(body.password);
    await authRepository.insert({ ...body, hash: hash });
    return {
      status: true,
      message: "Authentication successfull",
      data: {
        email: body.email,
        name: body.name,
      },
    };
  }

  async login(body) {
    await comparePassword(body.password, body.password_hash);
    const token = await jwtHelper.createJwt(body.id, body.role);
    return {
      status: true,
      message: "Authentication successfull",
      data: {
        id: body.id,
        email: body.email,
        name: body.name,
        role: body.role,
        token: token,
      },
    };
  }
}

module.exports = new AuthService();
