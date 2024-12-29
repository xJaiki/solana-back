require("dotenv").config();
const express = require("express");
const session = require("express-session");

const { initKeycloak } = require("./config/keycloak");

const swaggerUi = require("swagger-ui-express");
const swaggerFileV1 = require("../src/config/swagger/swagger_output_v1.json");


async function main() {
  const app = express();
  app.use(express.json());

  // Sessioni
  const memoryStore = new session.MemoryStore();
  app.use(
    session({
      secret: "my-secret-key",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  // Keycloak
  const keycloak = initKeycloak(memoryStore);
  app.use(keycloak.middleware());

  // Swagger
  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerFileV1));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("🚀 Fratm le API sono partite!");
    console.log(`📚 Documentazione: http://localhost:${PORT}/v1/docs`);
    console.log(`🔍 Endpoint delle api : http://localhost:${PORT}/v1/`);
  });

  // Routes
    const authRoutes = require("./routes/v1/auth.routes");
  app.use("/v1/auth", authRoutes);

  // Error handler
  app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: err.message });
  });
}

main().catch((err) => {
  console.error("Errore di avvio:", err);
});
