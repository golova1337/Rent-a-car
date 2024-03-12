/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("lease", (table) => {
    table.increments("id").unsigned();
    table.integer("user_id").unsigned();
    table.integer("car_id").unsigned();
    table.dateTime("start_time");
    table.dateTime("end_time");
    table.enu("status", ["active", "inactive"]).notNullable().defaultTo("active");
    table.foreign("user_id").references("id").inTable("users");
    table.foreign("car_id").references("id").inTable("cars");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("lease");
};
