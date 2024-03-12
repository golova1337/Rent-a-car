const UserDataAccess = require("../../db/queryDb/users/User.dataAccess");
const { comparePassword, hashingPassword } = require("../../utils/bcrypt/password");
const { createJwt } = require("../../utils/jwt/createJwt");

class UserSevice {
  constructor(knex) {
    this.knex = knex;
    this.userDataAccess = new UserDataAccess(this.knex);
  }

  async singUp(name, lastname, email, password, role) {
    try {
      await this.userDataAccess.checkExistUserBDsignUp(email);
      const hash = await hashingPassword(password);
      const result = await this.userDataAccess.insertNewUser(name, lastname, email, hash, role);
      return result;
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  async login(body) {
    const { role, password_hash: passwordHash, id } = await this.userDataAccess.checkExistUserBDlogin(body.email);
    await comparePassword(body.password, passwordHash);
    const token = await createJwt(body.email, role);
    return { id, token };
  }
}

module.exports = UserSevice;
