/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("lease").del();
  await knex("cars").del();
  await knex("cars").insert([
    {
      id: 1,
      brand: "BMW",
      model: "M5",
      year: 2020,
      number_plate: "AX1112",
      price: 1222,
    },
    {
      id: 2,
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      number_plate: "BX2234",
      price: 1500,
    },
    {
      id: 3,
      brand: "Mercedes-Benz",
      model: "E-Class",
      year: 2015,
      number_plate: "CX3456",
      price: 1800,
    },

    {
      id: 4,
      brand: "Audi",
      model: "A4",
      year: 2020,
      number_plate: "DX4567",
      price: 1350,
    },
    {
      id: 5,
      brand: "Honda",
      model: "Civic",
      year: 2019,
      number_plate: "EX5678",
      price: 1400,
      status: "in_rent",
    },
  ]);
};
