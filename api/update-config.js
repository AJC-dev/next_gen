import { createClient } from '@vercel/kv';

// Initialize the KV client using the REDIS_URL from environment variables
const kv = createClient({
  url: process.env.REDIS_URL,
});

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const newConfig = request.body;
        
        // Save the new configuration object to the Vercel KV store
        await kv.set('postcard-config', newConfig);

        console.log("Successfully saved new configuration to Vercel KV.");

        return response.status(200).json({ message: 'Configuration saved successfully.' });

    } catch (error) {
        console.error('Error saving configuration to Vercel KV:', error);
        return response.status(500).json({ message: 'Error saving configuration.' });
    }
}

