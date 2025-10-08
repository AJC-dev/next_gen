import { createClient } from '@vercel/kv';

// Initialize the KV client using the REDIS_URL from environment variables
const kv = createClient({
  url: process.env.REDIS_URL,
});


export default async function handler(request, response) {
    try {
        const config = await kv.get('postcard-config');
        if (!config) {
            return response.status(404).json({ message: 'Configuration not found.' });
        }
        return response.status(200).json(config);
    } catch (error) {
        console.error('Error fetching configuration from Vercel KV:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return response.status(500).json({ message: 'Error fetching configuration.', details: errorMessage });
    }
}