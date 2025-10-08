import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Get the new configuration object from the request body
        const newConfig = request.body;
        
        // Save the new configuration object to the Vercel KV store
        // using the key 'postcard-config'
        await kv.set('postcard-config', newConfig);

        console.log("Successfully saved new configuration to Vercel KV.");

        // Respond with a success message
        return response.status(200).json({ message: 'Configuration saved successfully.' });

    } catch (error) {
        console.error('Error saving configuration to Vercel KV:', error);
        return response.status(500).json({ message: 'Error saving configuration.' });
    }
}

