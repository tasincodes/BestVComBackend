const { createClient } = require('redis');

let redisClientPromise;

function getRedisClient() {
  if (!redisClientPromise) {
    redisClientPromise = new Promise((resolve, reject) => {
      const redisClient = createClient({
        url: 'redis://localhost:6379', // Use a single URL for better readability
      });

      redisClient.on('connect', () => {
        console.log('Connected to Redis');
      });

      redisClient.on('ready', () => {
        console.log('Redis client is ready');
        resolve(redisClient);
      });

      redisClient.on('error', (err) => {
        console.error('Redis error:', err);
        reject(err);
      });

      redisClient.on('end', () => {
        console.log('Redis client disconnected');
      });

      redisClient.on('reconnecting', () => {
        console.log('Redis client reconnecting');
      });
    });
  }
  console.log('Returning Redis client promise', redisClientPromise);
  return redisClientPromise;
}

module.exports = getRedisClient;
