# Clona il repository
`git clone https://github.com/tuo-username/solana-back.git`
`cd solana-back`

# Installa le dipendenze
`npm install`

# Avvia Keycloak 
`bin\kc.bat start-dev`

# Esegui le migrazioni
`npx knex migrate:latest`

# Esegui i seed
`npx knex seed:run`

# Avvia il server in locale
`npm run start`

# Genera/aggiorna la documentazione (se impostato in package.json)
`npm run swagger`




