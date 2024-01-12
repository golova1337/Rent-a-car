/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Users',(table)=>{
    table.increments('id_users');
    table.string('name',50).notNullable();
    table.string('lastName',50).notNullable();
    table.string('email').notNullable().unique();
    table.enu('role', ['user', 'admin', 'superadmin']).notNullable();
    table.boolean('is_deleted').defaultTo(false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
