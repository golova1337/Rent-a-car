const { TABLES } = require("../config/tablesUsers");
const { knex } = require("../config/connection");

class UserRepository {
  constructor(connection) {
    this.knex = connection;
  }

  async insert(body) {
    const result = await this.knex(TABLES.USERS).insert({
      name: body.name,
      lastname: body.lastname,
      email: body.email,
      role: body.role,
      password_hash: body.hash,
    });
    return result;
  }

  async delete(id) {
    return this.knex(TABLES.USERS)
      .where({ id: id })
      .update({
        deleted_at: this.knex.fn.now(6),
      });
  }

  async getAll(pagination, role) {
    const [data, count] = await Promise.all([
      this.knex
        .select("id", "name", "lastname", "email", "role")
        .from(TABLES.USERS)
        .limit(pagination.perPage)
        .offset((pagination.page - 1) * pagination.perPage)
        .where({
          role: role,
          deleted_at: null,
        }),
      this.knex.from(TABLES.USERS).count("role as count ").where({
        role: role,
      }),
    ]);
    return [data, count];
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
