require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  },

  // TODO: configurazione di prod
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
      // eventuali SSL o parametri extra
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/seeds'
    }
  }
};
