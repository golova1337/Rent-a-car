const UserAccess = require("../../db/query/user/User.Access");
const { comparePassword, hashingPassword } = require("../../utils/bcrypt/password");
const { createJwt } = require("../../utils/jwt/createJwt");

class UserSevice {
  constructor(knex) {
    this.knex = knex;
    this.userAccess = new UserAccess(this.knex);
  }

  async singUp(body) {
    try {
      const hash = await hashingPassword(body.password);
      const result = await this.userAccess.insertNewUser({ ...body, hash: hash });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(body) {
    const { role, password_hash: passwordHash, id } = await this.userAccess.checkUserExistByEmail(body.email);
    await comparePassword(body.password, passwordHash);
    const token = await createJwt(id, role);
    return token;
  }
}

module.exports = UserSevice;
