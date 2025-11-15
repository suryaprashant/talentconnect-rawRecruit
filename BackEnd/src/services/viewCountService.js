import redis from 'redis';
import { JobPostingTable } from '../models/jobPostingsModel.js'

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

const client = redis.createClient({
    socket: {
        host: redisHost,
        port: redisPort,
    },
    password: redisPassword,
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
        console.log("connected with redis")
    }
}

connectRedis().catch(console.error);

export async function viewCountService(jobId, viewerId) {
    console.log("called");
    if (!viewerId) {
        throw new Error('No viewerId provided');
    }

    await connectRedis();
    console.log(jobId, viewerId);
    const redisKey = `viewed:${jobId}:${viewerId}`;

    const alreadyViewed = await client.exists(redisKey);
    if (alreadyViewed) {
        return false;
    }

    // mark viewed - 7 days expiry
    await client.set(redisKey, '1', { EX: 604800 });
    await JobPostingTable.findByIdAndUpdate(jobId, { $inc: { views: 1 } });
    return true;
}