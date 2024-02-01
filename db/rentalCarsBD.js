async function RentalCarsBD(knex) {
  try {
    const getCarsInRenting = await knex("cars")
      .select("brand", "model", "year", "number_plate", "price")
      .where({ in_renting: true });
    return getCarsInRenting;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  RentalCarsBD,
};
