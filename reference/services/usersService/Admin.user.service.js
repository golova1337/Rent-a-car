const AdminUserData = require("../../db/queryDb/users/Admin.deleteAccess");

class AdminUserService {
  constructor(knex) {
    this.knex = knex;
    this.adminUserData = new AdminUserData(this.knex);
  }

  async deleteUserBD(id) {
    await this.adminUserData.deleteUserBD(id);
  }

  async getAllUsers() {
    const result = await this.adminUserData.getAllUsersBd();
    return result;
  }
}
module.exports = AdminUserService;
