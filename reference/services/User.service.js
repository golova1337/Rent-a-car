const UserRepository = require("../db/repository/User.repository");
const { hashingPassword } = require("../utils/bcrypt/password");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async singUp(body) {
    try {
      const hash = await hashingPassword(body.password);
      await this.userRepository.insert({ ...body, hash: hash });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id) {
    await this.userRepository.delete(id);
  }

  async getAll(role) {
    const result = await this.userRepository.getAll(role);
    return result;
  }
}

module.exports = new UserService(UserRepository);
