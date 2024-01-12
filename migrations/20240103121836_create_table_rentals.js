/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Rentals',(table)=>{
    table.increments('rental_id').unsigned();
    table.string('user_email').notNullable().unique()
    table.string('car_number',20).unique().notNullable();
    table.dateTime('start_date');
    table.dateTime('end_date');
    table.foreign('user_email').references('email').inTable('users');
    table.foreign('car_number').references('number').inTable('cars');

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('rentals');

};
