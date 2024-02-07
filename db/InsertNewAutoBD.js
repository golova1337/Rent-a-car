async function InsertNewAutoBD(knex, brand, model, numberPlate, price, year) {
  await knex("cars").insert({
    brand: brand,
    model: model,
    year: year,
    number_plate: numberPlate,
    price: price,
  });
}

module.exports = {
  InsertNewAutoBD,
};
