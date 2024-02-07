async function InsertNewUser(knex, name, lastname, email, HashResult, role) {
  const trx = await knex.transaction();

  try {
    const resultInsertBody = await trx("users").insert({
      name: name,
      last_name: lastname,
      email: email,
      role: role,
    });

    await trx("user_passwords").insert({
      user_id: resultInsertBody,
      password_hash: HashResult,
    });
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = {
  InsertNewUser,
};
