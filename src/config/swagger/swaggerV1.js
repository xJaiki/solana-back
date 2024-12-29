const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Solana API',
    description: 'API di Solana, create da Mario 🐔'
  },
  host: 'localhost:3000',
  tags: [
    {
      name: 'Test',
      description: 'API di test'
    },
    {
      name: 'Hello',
      description: 'API di Solana'
    }
  ]
};

const outputFile = './swagger_output_v1.json';
const endpointsFiles = [
  './src/index.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
