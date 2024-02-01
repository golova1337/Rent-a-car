async function DeleteUserBD(knex, email) {
  await knex("users").where({ email: email }).update({ is_deleted: true });
}

module.exports = {
  DeleteUserBD,
};
