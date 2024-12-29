const KeycloakAdminClient = require('keycloak-admin').default;
const knexConfig = require('../../../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);

/**
 * Registra un utente su Keycloak e in DB "users".
 * Se viene passato "clientId", lo associamo in "user_clients".
 */
async function registerUser({
  firstName,
  lastName,
  email,
  password,
  clientId,
  roleInClient
}) {
  // 1. Creiamo l'utente su Keycloak (admin flow)
  const adminClient = new KeycloakAdminClient();
  await adminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PWD,
    grantType: 'password',
    clientId: 'admin-cli' // Oppure process.env.KEYCLOAK_CLIENT_ID se configurato
  });

  const newKcUser = await adminClient.users.create({
    realm: process.env.KEYCLOAK_REALM,
    username: email,
    email,
    firstName,
    lastName,
    enabled: true,
    credentials: [{
      type: 'password',
      value: password,
      temporary: false
    }]
  });
  // Keycloak ID
  const keycloakId = newKcUser.id;

  // 2. Salviamo nel DB "users"
  const [userId] = await knex('users').insert({
    keycloak_id: keycloakId,
    firstName,
    lastName,
    email
  });

  // 3. Se vogliamo associare l'utente a un client
  if (clientId) {
    // Verifichiamo che il client esista
    const clientExists = await knex('clients')
      .where({ id: clientId })
      .first();
    if (!clientExists) {
      throw new Error(`Client ID ${clientId} non esiste!`);
    }
    // Creiamo record su user_clients
    await knex('user_clients').insert({
      user_id: userId,
      client_id: clientId,
      role_in_client: roleInClient || 'operatore' // default
    });
  }

  return {
    message: 'Registrazione completata',
    userId,
    keycloakId
  };
}

/**
 * Debug login (solo dev)
 */
async function debugLogin(email) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Debug login non è disponibile in produzione!');
  }

  const user = await knex('users').where({ email }).first();
  if (!user) {
    throw new Error(`Utente con email ${email} non trovato`);
  }

  // Potresti generare un token finto
  const debugToken = `DEBUG-TOKEN-${user.id}-${Date.now()}`;

  // Se vuoi mostrare anche i clients associati
  const clientsAssociated = await knex('user_clients as uc')
    .join('clients as c', 'uc.client_id', 'c.id')
    .select('c.name', 'uc.role_in_client')
    .where('uc.user_id', user.id);

  return {
    token: debugToken,
    user,
    clients: clientsAssociated
  };
}

/**
 * Reset password - flusso Keycloak (versione semplificata)
 */
async function resetPasswordFlow(email) {
  const adminClient = new KeycloakAdminClient();
  await adminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PWD,
    grantType: 'password',
    clientId: 'admin-cli'
  });

  // Troviamo l'utente su Keycloak
  const kcUsers = await adminClient.users.find({
    realm: process.env.KEYCLOAK_REALM,
    username: email
  });
  if (!kcUsers.length) {
    throw new Error(`Nessun utente Keycloak con username/email = ${email}`);
  }
  const kcUser = kcUsers[0];

  // Forziamo la password temporanea
  await adminClient.users.resetPassword({
    realm: process.env.KEYCLOAK_REALM,
    id: kcUser.id,
    credential: {
      type: 'password',
      value: 'NewPwd_123',
      temporary: true
    }
  });

  return { message: `Password resettata per l'utente ${email}, nuova password temporanea: NewPwd_123` };
}

module.exports = {
  registerUser,
  debugLogin,
  resetPasswordFlow
};
