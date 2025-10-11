import { createClient } from '@vercel/kv';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';


// This is a placeholder for your actual print API call
async function sendToPrintAPI(postcardData) {
    console.log("SIMULATING: Sending to Zap-Post API with data:", postcardData);
    // In a real application, you would make a fetch() call to the Zap-Post endpoint here.
    return { success: true };
}

const kv = createClient({
  url: process.env.upstash_pc_KV_REST_API_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export default async function handler(request, response) {
    // Vercel automatically parses query parameters
    const { token } = request.query;

    if (!token) {
        return response.status(400).send('<h1>Error</h1><p>Missing verification token.</p>');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { postcardData } = decoded;
        const { sender, recipient, confirmationEmailConfig } = postcardData;
        
        // Create a unique key for the user based on their email
        const userKey = `postcards:${sender.email}`;
        const now = Date.now();
        const postcardId = `${userKey}:${now}`;

        // Log the postcard send event using a sorted set for time-based queries
        await kv.zadd(userKey, { score: now, member: postcardId });
        
        await kv.set(postcardId, {
            sender: sender,
            recipient: recipient,
            sentAt: now,
            frontImage: postcardData.frontImageUrl,
            backImage: postcardData.backImageUrl
        });

        // Make the final call to the print API
        await sendToPrintAPI(postcardData);

        // Send the final confirmation email
        const confirmationMsg = {
            to: sender.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: confirmationEmailConfig.subject,
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>${confirmationEmailConfig.senderName}</h2>
                    <p>${confirmationEmailConfig.body}</p>
                </div>
            `
        };
        await sgMail.send(confirmationMsg);


        // Redirect to the success page
        const proto = request.headers['x-forwarded-proto'] || 'http';
        const host = request.headers['x-forwarded-host'] || request.headers.host;
        const successUrl = new URL('/success.html', `${proto}://${host}`);
        
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

