async function FilterCarsBD(knex, params) {
  try {
    for (const key in params) {
      if (params[key].trim().length === 0) {
        delete params[key];
      }
    }
    const rows = await knex("cars").select("brand", "model", "year", "price").where(params);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  FilterCarsBD,
};
