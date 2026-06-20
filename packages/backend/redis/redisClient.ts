import 'dotenv/config';
import { createClient, BasicClientSideCache } from 'redis'

//------ Redis Setup ------//
const cache = new BasicClientSideCache({
    ttl: 0,
    maxEntries: 0,
    evictPolicy: 'LRU'
})
const redisClient = createClient({
    url: process.env.REDIS_URL,
    RESP: 3,
    clientSideCache: cache
})
redisClient.on('error', (err) => console.log('Redis Client Error', err))
redisClient.on('connect', () => console.log('Succesfully Connected To Redis!'))
await redisClient.connect();

export {redisClient}
