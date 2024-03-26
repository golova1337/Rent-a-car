const { TABLES } = require("../config/tablesUsers");
const { knex } = require("../config/connection");

class UserRepository {
  constructor(connection) {
    this.knex = connection;
  }

  async insert(body) {
    const result = await this.knex(TABLES.USERS).returning("create_at").insert({
      name: body.name,
      lastname: body.lastname,
      email: body.email,
      role: body.role,
      password_hash: body.hash,
    });
    return result;
  }

  async delete(id, date) {
    await this.knex(TABLES.USERS).where({ id: id }).update({
      deleted_at: date,
    });
  }

  async getAll(role) {
    const result = await this.knex.select("id", "name", "lastname", "email", "role").from(TABLES.USERS).where({
      role: role,
      deleted_at: null,
    });
    return result;
  }

  async getOne(id) {
    const result = await this.knex.select("id", "name", "lastname", "email", "role").from(TABLES.USERS).where({
      id: id,
      deleted_at: null,
    });
    return result[0];
  }
}
module.exports = new UserRepository(knex);
