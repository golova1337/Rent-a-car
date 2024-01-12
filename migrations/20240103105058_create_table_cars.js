/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('Cars',(table)=>{
    table.increments('id_car').unsigned();
    table.string('Brand',20).notNullable();
    table.string('Model',20).notNullable();
    table.specificType('Year', 'smallint(4)').notNullable().unsigned();
    table.string('Number',20).unique().notNullable();
    table.integer('Price').notNullable().unsigned();
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
