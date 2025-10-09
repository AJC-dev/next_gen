import { createClient } from '@vercel/kv';

// Initialize the KV client with the new Upstash environment variables
const kv = createClient({
  url: process.env.upstash_pc_KV_REST_API_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
    try {
        const config = await kv.get('postcard-config');
        if (!config) {
            return response.status(404).json({ message: 'Configuration not found.' });
        }
        return response.status(200).json(config);
    } catch (error) {
        console.error('Error fetching configuration from Upstash KV:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return response.status(500).json({ message: 'Error fetching configuration.', details: errorMessage });
    }
}

