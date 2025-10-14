import { Redis } from '@upstash/redis';

// Initialize the Upstash Redis client directly
const redis = new Redis({
  url: process.env.upstash_pc_REDIS_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
    try {
        const config = await redis.get('postcard-config');
        if (!config) {
            return response.status(404).json({ message: 'Configuration not found.' });
        }
        return response.status(200).json(config);
    } catch (error) {
        console.error('Error fetching configuration from Upstash:', error);
        return response.status(500).json({ message: 'Error fetching configuration.' });
    }
}

