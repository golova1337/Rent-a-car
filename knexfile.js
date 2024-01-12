// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost', 
      user: 'root', 
      password: 'password', 
      database: 'test' 
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations' // Директория для хранения файлов миграций
    }
  }
}
