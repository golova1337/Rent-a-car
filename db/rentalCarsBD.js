async function RentalCarsBD(knex) {
  const getCarsInRenting = await knex("cars").select("brand", "model", "year", "number_plate", "price").where({ in_renting: true });
  return getCarsInRenting;
}

module.exports = {
  RentalCarsBD,
};
