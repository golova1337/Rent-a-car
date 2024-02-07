async function getAllUsersBd(knex, role) {
  const getAllUsers = await knex.select("name", "last_name", "email").from("users").where({
    role: role,
    is_deleted: false,
  });
  return getAllUsers;
}

module.exports = {
  getAllUsersBd,
};
