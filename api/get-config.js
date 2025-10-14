import { Redis } from '@upstash/redis';
import fallbackConfig from '../js/config.js';

// Initialize the Upstash Redis client directly
const redis = new Redis({
  url: process.env.upstash_pc_KV_REST_API_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
    let config;
    try {
        // 1. Try to fetch the main configuration from the database
        const dbConfig = await redis.get('postcard-config');
        if (dbConfig) {
            config = dbConfig;
        } else {
            // 2. If no config is in the DB, use the local file as the base
            config = fallbackConfig;
        }

        // 3. Securely merge in the server-side environment variables
        config.apiKeys = {
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
            pixabayApiKey: process.env.PIXABAY_API_KEY,
        };

        return response.status(200).json(config);

    } catch (error) {
        console.error('Error fetching configuration:', error);
        // Fallback to local config on any error
        let config = fallbackConfig;
         config.apiKeys = {
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
            pixabayApiKey: process.env.PIXABAY_API_KEY,
        };
        return response.status(200).json(config); // Still return a valid config object on error
    }
}

