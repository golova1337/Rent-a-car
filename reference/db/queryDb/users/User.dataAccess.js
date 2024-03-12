const { TABLES } = require("../../config/tablesUsers");

class UserDataAccess {
  constructor(knex) {
    this.knex = knex;
  }

  async checkExistUserBDsignUp(email) {
    const rowsUser = await this.knex.select("*").from(TABLES.USERS).where({ email: email });
    if (rowsUser.length > 0) throw new Error("You exist");
  }

  async insertNewUser(name, lastname, email, HashResult, role) {
    const trx = await this.knex.transaction();
    try {
      const resultInsertBody = await trx(TABLES.USERS).insert({
        name: name,
        lastname: lastname,
        email: email,
        role: role,
      });
      await trx(TABLES.USER_PASSWORDS).insert({
        user_id: resultInsertBody,
        password_hash: HashResult,
      });
      await trx.commit();
      return resultInsertBody[0];
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async checkExistUserBDlogin(email) {
    const userData = await this.knex
      .select(`${TABLES.USERS}.role`, `${TABLES.USER_PASSWORDS}.password_hash`, `${TABLES.USERS}.id`)
      .from(TABLES.USERS)
      .leftJoin(TABLES.USER_PASSWORDS, `${TABLES.USERS}.id`, "=", `${TABLES.USER_PASSWORDS}.user_id`)
      .where({ email });

    if (userData.length === 0) throw new Error("You don't exist");
    if (userData[0].is_deleted) throw new Error("You cannot login");

    return userData[0];
  }
}
module.exports = UserDataAccess;
