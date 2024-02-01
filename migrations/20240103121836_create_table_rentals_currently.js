/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rentals_currently", (table) => {
    table.increments("id").unsigned();
    table.integer("user_id").unique().unsigned().notNullable();
    table.string("number_plate", 20).unique().notNullable();
    table.dateTime("start_date");
    table.dateTime("end_date");
    table.foreign("user_id").references("id").inTable("users");
    table.foreign("number_plate").references("number_plate").inTable("cars");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("rentals");
};
