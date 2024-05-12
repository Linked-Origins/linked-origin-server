const redis = require("redis");

// Initialize Redis client
const redisClient = redis.createClient({
  host: "127.0.0.1", // The IP address of your Redis server
  port: 6379, // The port of your Redis server
});

// Error handling
redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

// Connect to Redis server
redisClient
  .connect()
  .then(() => {
    console.log("Redis client connected");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

// Export the Redis client
module.exports = redisClient;
