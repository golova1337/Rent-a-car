const authRepository = require("../db/repository/Auth.repository");
const { comparePassword, hashingPassword } = require("../helpers/auth/password");
const jwtHelper = require("../helpers/jwt/jwt.helper");

class AuthService {
  async singUp(body) {
    const hash = await hashingPassword(body.password);
    await authRepository.insert({ ...body, hash: hash });
    const { password, ...data } = body;
    return data;
  }

  async login(body) {
    await comparePassword(body.password, body.password_hash);
    const token = await jwtHelper.createJwt(body.id, body.role);
    const { password_hash, password, id, ...data } = body;
    return { ...data, token: token };
  }
}

module.exports = new AuthService();
