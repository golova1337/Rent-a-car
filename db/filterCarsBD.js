async function FilterCarsBD(knex, params) {
  const data = {};
  Object.keys(params).forEach((key) => {
    if (params[key].trim().length !== 0) {
      data[key] = params[key];
    }
  });
  data.is_deleted = false;
  data.in_renting = false;

  const rows = await knex("cars").select("brand", "model", "year", "price").where(data);

  return rows;
}

module.exports = {
  FilterCarsBD,
};
