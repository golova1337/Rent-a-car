/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_passwords',(table)=>{
    table.increments('id');
    table.integer('user_id').unsigned().notNullable();
    table.string('password_hash').notNullable();
    table.foreign('user_id').references('id_users').inTable('users');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_passwords');
};
