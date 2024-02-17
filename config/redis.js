import redis from 'redis';

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
});

export default redisClient;