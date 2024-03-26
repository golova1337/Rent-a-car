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
    table.string("password_hash").notNullable();
    table.enu("role", ["user", "admin", "superadmin"]).notNullable();
    table.timestamps(true, true);
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
