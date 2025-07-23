import initApp from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const app = initApp();

  app.listen(PORT, () => {
    logger.info(`Backend running on http://localhost:${PORT}`);
  });
};

startServer();