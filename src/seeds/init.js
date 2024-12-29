/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex) {
  // 1. Puliamo prima le tabelle che dipendono da 'clients' e 'users'
  await knex('user_clients').del();
  await knex('users').del();
  await knex('clients').del();

  // 2. Inseriamo un paio di clients
  const [clientId1] = await knex('clients').insert({
    name: 'Lido Sole',
    address: 'Via Mare 123',
    phone: '123456789',
    email: 'lido-sole@example.com',
    custom_data: JSON.stringify({ note: 'Lido storico' })
  });

  const [clientId2] = await knex('clients').insert({
    name: 'Lido Luna',
    address: 'Via Spiaggia 45',
    phone: '987654321',
    email: 'lido-luna@example.com',
    custom_data: JSON.stringify({ note: 'Nuovo lido' })
  });
};

