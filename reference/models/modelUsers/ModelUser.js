const { BaseModel } = require("../modelBasic/BaseModel");
const { TABLES } = require("../../db/config/tablesUsers");

class UsersModel extends BaseModel {
  constructor(databaseConnection) {
    super(databaseConnection);
    this.usersTable = TABLES.USERS;
    this.userPasswordsTable = TABLES.USER_PASSWORDS;
  }

  async checkExistUserBDsignUp(email) {
    const rowsUser = await this.knex.select("*").from(this.usersTable).where({ email: email });
    if (rowsUser.length > 0) throw new Error("You exist");
  }

  async checkExistUserBDlogin(email) {
    const rowsUser = await this.knex.select("*").from(this.usersTable).where({ email: email });
    if (rowsUser.length === 0) throw new Error("you dont exist");
    if (rowsUser[0].is_deleted) throw new Error("you can not login");
    const rowsPassword = await this.knex.select("password_hash").from(this.userPasswordsTable).where({ user_id: rowsUser[0].id });
    return [rowsUser[0].role, rowsPassword[0].password_hash, rowsUser[0].id];
  }

  async insertNewUser(name, lastname, email, HashResult, role) {
    const trx = await this.knex.transaction();

    try {
      const resultInsertBody = await trx(this.usersTable).insert({
        name: name,
        lastname: lastname,
        email: email,
        role: role,
      });
      await trx(this.userPasswordsTable).insert({
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

  async deleteUserBD(id) {
    const date = new Date();
    await this.knex(this.usersTable).where({ id: id }).update({
      is_deleted: true,
      deleted_at: date,
    });
  }

  async getAllUsersBd() {
    const getAllUsers = await this.knex.select("id", "name", "lastname", "email").from(this.usersTable).where({
      role: "user",
      is_deleted: false,
    });
    return getAllUsers;
  }
}

module.exports = UsersModel;
