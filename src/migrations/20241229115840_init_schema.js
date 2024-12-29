/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1) TABELLA CLIENTS
    await knex.schema.createTable('clients', table => {
      table.increments('id').primary().comment('ID univoco del lido/cliente');
      table.string('name', 255).notNullable().comment('Nome del lido o struttura');
      table.string('address', 255).comment('Indirizzo');
      table.string('phone', 255).comment('Numero di telefono');
      table.string('email', 255).comment('Email di riferimento');
      table.json('custom_data').comment('Campo JSON per personalizzazioni su misura');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
  
    // 2) TABELLA USERS
    await knex.schema.createTable('users', table => {
      table.increments('id').primary().comment('ID univoco utente');
      table.string('keycloak_id', 255).unique().comment('ID utente su Keycloak');
      table.string('firstName', 255).comment('Nome');
      table.string('lastName', 255).comment('Cognome');
      table.string('email', 255).comment('Email di contatto, non per login');
      table.string('profilePicture', 255).comment('URL immagine profilo');
      table.string('cellphone', 255).comment('Numero di telefono');
      table.integer('level').defaultTo(100).comment('Ruolo (100=utente, 1=admin, 2=operatore, ecc.)');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
  
    // 3) TABELLA user_clients (tabella ponte per la multi-tenancy)
    await knex.schema.createTable('user_clients', table => {
      table.increments('id').primary();
      table.integer('client_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.string('role_in_client', 255).comment('Ruolo specifico di quell utente in quel lido (es. admin, operatore)');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
  
      // Foreign key
      table.foreign('client_id').references('id').inTable('clients');
      table.foreign('user_id').references('id').inTable('users');
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.down = async function(knex) {
    // Il rollback avviene in ordine inverso
    await knex.schema.dropTableIfExists('user_clients');
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('clients');
  };