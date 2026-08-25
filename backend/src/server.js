require("dotenv").config();
const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 5000;

async function main() {
  // Vérifie la connexion à la base avant de démarrer le serveur
  await prisma.$connect();
  console.log(" Connexion à la base de données réussie");

  app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(" Erreur au démarrage du serveur :", err);
  process.exit(1);
});

// Arrêt propre de la connexion Prisma
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
