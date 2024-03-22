const { TABLES } = require("../config/tablesUsers");
const { knex } = require("../config/connection");
class UserRepository {
  constructor(connection) {
    this.knex = connection;
  }

  async insert(body) {
    const id = await this.knex(TABLES.USERS).insert({
      name: body.name,
      lastname: body.lastname,
      email: body.email,
      role: body.role,
      password_hash: body.hash,
    });
  }

  async delete(id) {
    const date = new Date();
    await this.knex(TABLES.USERS).where({ id: id }).update({
      is_deleted: true,
      deleted_at: date,
    });
  }

  async getAll(role) {
    // console.log(role);
    const result = await this.knex.select("id", "name", "lastname", "email").from(TABLES.USERS).where({
      role: role,
      is_deleted: false,
    });
    return result;
  }
}
module.exports = new UserRepository(knex);
