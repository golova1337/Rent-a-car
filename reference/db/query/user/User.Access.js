const { TABLES } = require("../../config/tablesUsers");

class UserAccess {
  constructor(knex) {
    this.knex = knex;
  }

  async insertNewUser(body) {
    const trx = await this.knex.transaction();
    try {
      const id = await trx(TABLES.USERS).insert({
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        role: body.role,
      });
      await trx(TABLES.USER_PASSWORDS).insert({
        user_id: id,
        password_hash: body.hash,
      });
      await trx.commit();
      return id[0];
    } catch (error) {
      await trx.rollback();
      if (error.sqlState === "23000") {
        throw new Error("User with this email already exists");
      }
      throw error;
    }
  }

  async checkUserExistByEmail(email) {
    const userData = await this.knex
      .select(`${TABLES.USERS}.role`, `${TABLES.USER_PASSWORDS}.password_hash`, `${TABLES.USERS}.id`)
      .from(TABLES.USERS)
      .leftJoin(TABLES.USER_PASSWORDS, `${TABLES.USERS}.id`, "=", `${TABLES.USER_PASSWORDS}.user_id`)
      .where({ email });

    if (userData.length === 0) throw new Error("You don't exist");
    if (userData[0].is_deleted) throw new Error("You cannot login");

    return userData[0];
  }

  async delete(id) {
    const date = new Date();
    await this.knex(TABLES.USERS).where({ id: id }).update({
      is_deleted: true,
      deleted_at: date,
    });
  }

  async getAll(role) {
    const getAll = await this.knex.select("id", "name", "lastname", "email").from(TABLES.USERS).where({
      role: role,
      is_deleted: false,
    });
    return getAll;
  }
}
module.exports = UserAccess;
