async function GetAllCarsBd(knex) {
  try {
    const result = await knex("cars").select("brand", "model", "year", "price").where({
      in_renting: false,
      is_deleted: false,
    });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  GetAllCarsBd,
};
