const { TABLES } = require("../../config/tablesUsers");

class AdminUserData {
  constructor(knex) {
    this.knex = knex;
  }

  async deleteUserBD(id) {
    const date = new Date();
    await this.knex(TABLES.USERS).where({ id: id }).update({
      is_deleted: true,
      deleted_at: date,
    });
  }

  async getAllUsersBd() {
    const getAllUsers = await this.knex.select("id", "name", "lastname", "email").from(TABLES.USERS).where({
      role: "user",
      is_deleted: false,
    });
    return getAllUsers;
  }
}

module.exports = AdminUserData;
