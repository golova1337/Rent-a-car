/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.string("lastname", 50).notNullable();
    table.string("email").notNullable().unique();
    table.enu("role", ["user", "admin", "superadmin"]).notNullable();
    table.timestamps(true, true);
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("deleted_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
