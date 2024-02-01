async function DeleteAutoBD(knex, number_plate) {
  try {
    const result = await knex("cars").where({ number_plate: number_plate }).update({ is_deleted: true });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  DeleteAutoBD,
};
