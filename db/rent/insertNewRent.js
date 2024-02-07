async function InsertNewRent(knex, data) {
  const trx = await knex.transaction();
  try {
    // Get the car
    const getCar = await trx("cars").first("number_plate").where({
      brand: data.brand,
      model: data.model,
      year: data.year,
      in_renting: false,
      is_deleted: false,
    });
    // Insert data into "rentals_currently";
    await trx("rentals_currently").insert({
      user_id: data.user_id,
      number_plate: getCar.number_plate,
      start_date: data.startTime,
      end_date: data.endTime,
    });
    // Update 'in_renting' in Cars;
    await trx("cars").where({ number_plate: getCar.number_plate }).update({ in_renting: true });

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = {
  InsertNewRent,
};
