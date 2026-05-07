import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectRedis } from './config/redis';

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(env.PORT, () => {
      logger.info(`Server listening on port \${env.PORT} in \${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
