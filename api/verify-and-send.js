import { createClient } from '@vercel/kv';
import jwt from 'jsonwebtoken';

// This is a placeholder for your actual print API call
async function sendToPrintAPI(postcardData) {
    console.log("SIMULATING: Sending to Zap-Post API with data:", postcardData);
    // In a real application, you would make a fetch() call to the Zap-Post endpoint here.
    // For example:
    // const response = await fetch('https://zappost.com/api/v1/prints', {
    //     method: 'POST',
    //     headers: { 'Authorization': `Bearer ${process.env.ZAPPOST_API_KEY}` },
    //     body: JSON.stringify(postcardData)
    // });
    // if (!response.ok) {
    //     throw new Error('Failed to send postcard to print API.');
    // }
    return { success: true };
}


const kv = createClient({
  url: process.env.upstash_pc_KV_REST_API_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
    // Vercel automatically parses query parameters
    const { token } = request.query;

    if (!token) {
        return response.status(400).send('<h1>Error</h1><p>Missing verification token.</p>');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { postcardData } = decoded;
        const { sender, recipient } = postcardData;
        
        // Create a unique key for the user based on their email
        const userKey = `postcards:${sender.email}`;
        const now = Date.now();
        // Create a unique ID for this specific postcard send event
        const postcardId = `${userKey}:${now}`;

        // Log the postcard send event using a sorted set for time-based queries
        await kv.zadd(userKey, { score: now, member: postcardId });
        
        // (Optional but good practice) Store the full details of the postcard send
        await kv.set(postcardId, {
            sender: sender,
            recipient: recipient,
            sentAt: now,
            frontImage: postcardData.frontImageUrl,
            backImage: postcardData.backImageUrl
        });

        // Make the final call to the print API
        await sendToPrintAPI(postcardData);

        // Redirect to the success page
        const proto = request.headers['x-forwarded-proto'] || 'http';
        const host = request.headers['x-forwarded-host'] || request.headers.host;
        const successUrl = new URL('/success.html', `${proto}://${host}`);
        
        // Perform a 302 redirect
        response.writeHead(302, { Location: successUrl.toString() });
        return response.end();

    } catch (error) {
        console.error('Verification error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return response.status(401).send('<h1>Error</h1><p>Your verification link is invalid or has expired. Please try sending your postcard again.</p>');
        }
        return response.status(500).send('<h1>Error</h1><p>An unexpected error occurred during verification. Please try again later.</p>');
    }
}

