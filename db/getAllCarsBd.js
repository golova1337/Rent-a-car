async function GetAllCarsBd(knex) {
  const result = await knex("cars").select("brand", "model", "year", "price").where({
    in_renting: false,
    is_deleted: false,
  });
  return result;
}

module.exports = {
  GetAllCarsBd,
};
