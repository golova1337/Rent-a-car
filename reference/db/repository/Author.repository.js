const { TABLES } = require("../config/tablesUsers");
const { knex } = require("../config/connection");
class AuthorRepository {
  constructor(connection) {
    this.knex = connection;
  }

  async insert(body) {
    await this.knex(TABLES.USERS).insert({
      name: body.name,
      lastname: body.lastname,
      email: body.email,
      role: body.role,
      password: body.hash,
    });
  }

  async checkByEmail(email) {
    const userData = await this.knex.select("role", "password_hash", "id").from(TABLES.USERS).where({ email });
    return userData[0];
  }
}
module.exports = new AuthorRepository(knex);
