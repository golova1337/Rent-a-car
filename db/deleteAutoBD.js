async function DeleteAutoBD(knex, numberPlate) {
  await knex("cars").where({ number_plate: numberPlate }).update({ is_deleted: true });
}

module.exports = {
  DeleteAutoBD,
};
