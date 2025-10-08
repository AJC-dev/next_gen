import { createClient } from '@vercel/kv';

// Initialize the KV client using the REDIS_URL from environment variables
const kv = createClient({
  url: process.env.REDIS_URL,
});

// Helper function to parse the request body stream into a JSON object
async function parseJSONBody(request) {
    const chunks = [];
    for await (const chunk of request) {
        chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString();
    return JSON.parse(body);
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // FIX: Correctly parse the incoming JSON from the request body stream
        const newConfig = await parseJSONBody(request);
        
        // Save the new configuration object to the Vercel KV store
        await kv.set('postcard-config', newConfig);

        console.log("Successfully saved new configuration to Vercel KV.");

        return response.status(200).json({ message: 'Configuration saved successfully.' });

    } catch (error) {
        console.error('Error saving configuration to Vercel KV:', error);
        return response.status(500).json({ message: 'Error saving configuration.' });
    }
}

