const UserRepository = require("../db/repository/User.repository");
const { hashingPassword } = require("../helpers/auth/password");

class UserService {
  async singUp(body) {
    const hash = await hashingPassword(body.password);
    await UserRepository.insert({ ...body, hash: hash });
    return {
      status: true,
      message: "Registration successful",
      data: {
        email: body.email,
        name: body.name,
      },
    };
  }

  async delete(id) {
    await UserRepository.delete(id);
    return {
      status: true,
      message: "Deletion successful",
      data: {
        id: id,
      },
    };
  }

  async getAll(role) {
    let result;
    if (!role || !role.trim().length) {
      result = await UserRepository.getAll("user");
      return {
        status: true,
        message: "Get successful",
        data: {
          result: result,
        },
      };
    }
    result = await UserRepository.getAll(role);
    return {
      status: true,
      message: "Get successful",
      data: {
        result: result,
      },
    };
  }
}

module.exports = new UserService();
