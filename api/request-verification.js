import { createClient } from '@vercel/kv';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// Initialize KV client and SendGrid
const kv = createClient({
  url: process.env.upstash_pc_KV_REST_API_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper to parse the request body
function parseJSONBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk.toString(); });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    request.on('error', (err) => { reject(err); });
  });
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { postcardData } = await parseJSONBody(request);
        const { sender } = postcardData;
        
        // Fetch the live configuration, which includes the limits
        const config = await kv.get('postcard-config');
        if (!config || !config.limits) {
             throw new Error("Usage limits are not configured in the database.");
        }
        const { postcardLimit, limitDays } = config.limits;

        // Create a unique key for the user to track their sends
        const userKey = `postcards:${sender.email}`;
        const now = Date.now();
        // Calculate the start of the time window for checking usage
        const cutoff = now - (limitDays * 24 * 60 * 60 * 1000);

        // Get the count of postcards sent by this user within the time window
        const recentPostcardsCount = await kv.zcount(userKey, cutoff, now);
        
        // Enforce the limit
        if (recentPostcardsCount >= postcardLimit) {
            return response.status(429).json({ message: `Usage limit reached. You can send ${postcardLimit} postcards every ${limitDays} days.` });
        }

        // If within limit, create a secure, short-lived token with the postcard data
        const token = jwt.sign({ postcardData }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const proto = request.headers['x-forwarded-proto'] || 'http';
        const host = request.headers['x-forwarded-host'] || request.headers.host;
        const verificationUrl = new URL(`/api/verify-and-send?token=${token}`, `${proto}://${host}`).toString();

        // Send the verification email using SendGrid
        const msg = {
            to: sender.email,
            from: process.env.SENDGRID_FROM_EMAIL, // Use the verified sender from environment variables
            subject: postcardData.emailConfig.subject,
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>${postcardData.emailConfig.senderName}</h2>
                    <p>${postcardData.emailConfig.body}</p>
                    <a href="${verificationUrl}" style="background-color: ${postcardData.emailConfig.buttonColor}; color: ${postcardData.emailConfig.buttonTextColor}; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Click Here to Verify & Send</a>
                    <hr style="margin: 20px 0;"/>
                    <p style="font-weight: bold;">Your Postcard Preview:</p>
                    <p>Front:</p>
                    <img src="${postcardData.frontImageUrlForEmail}" alt="Postcard Front" style="max-width: 100%; width: 400px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
                    <p style="margin-top: 20px;">Back:</p>
                    <img src="${postcardData.backImageUrlWithAddress}" alt="Postcard Back" style="max-width: 100%; width: 400px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
                </div>
            `,
        };

        await sgMail.send(msg);

        return response.status(200).json({ message: 'Verification email sent.' });

    } catch (error) {
        console.error('Request verification error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return response.status(500).json({ message: 'Internal Server Error', details: errorMessage });
    }
}