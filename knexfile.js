// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports  = {

  development: {
    client: process.env.BD_CLIENT,
    connection: {
      host: process.env.BD_HOST, 
      port:process.env.BD_PORT,
      user: process.env.BD_USER, 
      password: process.env.BD_PASSWORD, 
      database: process.env.BD_DATABASE 
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations' // Директория для хранения файлов миграций
    }
  }
}

