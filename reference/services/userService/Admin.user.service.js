const UserAccess = require("../../db/query/user/User.Access");

class AdminUserService {
  constructor(knex) {
    this.knex = knex;
    this.userAccess = new UserAccess(this.knex);
  }

  async delete(id) {
    await this.userAccess.delete(id);
  }

  async getAll(role) {
    const result = await this.userAccess.getAll(role);
    return result;
  }
}
module.exports = AdminUserService;
