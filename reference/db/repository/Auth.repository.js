const { TABLES } = require("../config/tablesUsers");
const { knex } = require("../config/connection");

class AuthRepository {
  constructor(connection) {
    this.knex = connection;
  }

  async insert(body) {
    return this.knex(TABLES.USERS).insert({
      name: body.name,
      lastname: body.lastname,
      email: body.email,
      role: body.role,
      password_hash: body.hash,
    });
  }

  async getByEmail(email) {
    const userData = await this.knex.select("name", "lastname", "role", "password_hash", "id", "deleted_at").from(TABLES.USERS).where({ email: email });
    return userData[0];
  }
}
module.exports = new AuthRepository(knex);
