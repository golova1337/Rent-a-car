/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('archive_lease',(table)=>{
    table.increments('rental_id').unsigned();
    table.string('email').notNullable();
    table.string('car_number',20).notNullable();
    table.dateTime('start_date');
    table.dateTime('end_date');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('archive_lease');
};
