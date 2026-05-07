import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export const connectRedis = async () => {
  if (!env.REDIS_URL) {
    logger.info('Redis URL not configured; continuing without Redis');
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
  }
};
