/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("cars", (table) => {
    table.increments("id").primary();
    table.string("brand", 20).notNullable();
    table.string("model", 20).notNullable();
    table.specificType("year", "smallint(4)").notNullable().unsigned();
    table.string("number_plate", 20).unique().notNullable();
    table.integer("price").notNullable().unsigned();
    table.enu("status", ["in_rent", "not_in_rent", "deleted"]).notNullable().defaultTo("not_in_rent");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("cars");
};
