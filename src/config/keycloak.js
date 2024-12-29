const Keycloak = require('keycloak-connect');
require('dotenv').config();

let _keycloak;

function initKeycloak(store) {
  if (_keycloak) {
    console.warn('Keycloak è già inizializzato.');
    return _keycloak;
  }
  const keycloakConfig = {
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    bearerOnly: false,
    serverUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
    credentials: {
      secret: process.env.KEYCLOAK_SECRET
    }
  };
  _keycloak = new Keycloak({ store }, keycloakConfig);
  console.log('Keycloak inizializzato con successo');
  return _keycloak;
}

function getKeycloak() {
  if (!_keycloak) {
    throw new Error('Keycloak non è inizializzato. Chiama initKeycloak() prima di getKeycloak().');
  }
  return _keycloak;
}

module.exports = {
  initKeycloak,
  getKeycloak
};
