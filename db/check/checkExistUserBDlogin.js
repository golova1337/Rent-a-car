async function CheckExistUserBDlogin(knex, email) {
  const rowsUser = await knex.select("*").from("users").where({ email: email });
  if (rowsUser.length === 0) throw new Error("you dont exist");
  if (rowsUser[0].is_deleted) throw new Error("you can not login");

  const rowsPassword = await knex.select("password_hash").from("user_passwords").where({ user_id: rowsUser[0].id });

  return {
    role: rowsUser[0].role,
    passwordHash: rowsPassword[0].password_hash,
  };
}
module.exports = {
  CheckExistUserBDlogin,
};
