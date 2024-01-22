/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cars',(table)=>{
    table.increments('id').unsigned();
    table.string('brand',20).notNullable();
    table.string('model',20).notNullable();
    table.specificType('year', 'smallint(4)').notNullable().unsigned();
    table.string('number_plate',20).unique().notNullable();
    table.integer('price').notNullable().unsigned();
    table.boolean('in_renting').defaultTo(false);
    table.boolean('is_deleted').defaultTo(false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cars');
};
