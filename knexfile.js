// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports  = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost', 
      port:3306,
      user: 'root', 
      password: 'root', 
      database: 'test' 
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations' // Директория для хранения файлов миграций
    }
  }
}

