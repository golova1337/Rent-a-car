async function returnCarBd(knex, data) {
  const trx = await knex.transaction();
  try {
    //Delete rental
    const deleteRent = await trx("rentals_currently").where({ number_plate: data.numberPlate }).del();
    if (deleteRent === 0) throw new Error("There is no rental car");
    //Update in_renting
    await trx("cars").where({ number_plate: data.numberPlate }).update({ in_renting: false });

    await trx.commit();
    return;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = {
  returnCarBd,
};
