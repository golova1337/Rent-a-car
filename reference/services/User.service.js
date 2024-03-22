const UserRepository = require("../db/repository/User.repository");
const { hashingPassword } = require("../helpers/auth/password");

class UserService {
  async singUp(body) {
    try {
      const hash = await hashingPassword(body.password);
      await UserRepository.insert({ ...body, hash: hash });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id) {
    await UserRepository.delete(id);
  }

  async getAll(role) {
    const result = await UserRepository.getAll(role);
    return result;
  }
}

module.exports = new UserService();
