import { createClient } from '@vercel/kv';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

// Makes the actual API call to the Zap-Post print service
async function sendToPrintAPI(postcardData) {
    console.log("Attempting to send to Zap-Post API");

    const { sender, recipient, frontImageUrl, backImageUrl, postcardPromoImageUrl } = postcardData;
    const { ZAPPOST_USERNAME, ZAPPOST_PASSWORD, ZAPPOST_CAMPAIGN_ID } = process.env;

    if (!ZAPPOST_USERNAME || !ZAPPOST_PASSWORD || !ZAPPOST_CAMPAIGN_ID) {
        throw new Error("Missing required Zap-Post environment variables.");
    }

    const customerId = `${sender.email}${recipient.postcode.replace(/\s/g, '')}`;

    // Structure the payload according to Zap-Post's API documentation
    const apiPayload = {
        campaignId: ZAPPOST_CAMPAIGN_ID,
        scheduledSendDateId: "",
        onlyValidRecords: true,
        submissions: [
            {
                customerid: customerId,
                email: sender.email,
                salutation: "",
                firstname: recipient.name,
                surname: "",
                companyname: "",
                address1: recipient.line1,
                address2: recipient.line2 || "",
                address3: "",
                city: recipient.city,
                postcode: recipient.postcode,
                country: recipient.country,
                currency: "GBP",
                language: "en",
                customdata: {
                    "front": frontImageUrl,
                    "message": backImageUrl,
                    "sender": sender.name,
                    "promo": postcardPromoImageUrl
                }
            }
        ]
    };

    const basicAuth = Buffer.from(`${ZAPPOST_USERNAME}:${ZAPPOST_PASSWORD}`).toString('base64');

    const response = await fetch('https://api.zappost.com/api/v1/records', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify(apiPayload)
    });

    if (!response.ok) { // Check for non-2xx status codes
        const errorBody = await response.text();
        throw new Error(`Failed to send postcard to print API. Status: ${response.status}. Body: ${errorBody}`);
    }

    console.log("Successfully sent to Zap-Post API.");
    return response.json();
}


const kv = createClient({
  url: process.env.upstash_pc_KV_REST_API_URL,
  token: process.env.upstash_pc_KV_REST_API_TOKEN,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export default async function handler(request, response) {
    const { token } = request.query;

    if (!token) {
        return response.status(400).send('<h1>Error</h1><p>Missing verification token.</p>');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { postcardData } = decoded;
        const { sender, recipient, confirmationEmailConfig } = postcardData;
        
        const userKey = `postcards:${sender.email}`;
        const now = Date.now();
        const postcardId = `${userKey}:${now}`;

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

        let subject = confirmationEmailConfig.subject.replace(/{{senderName}}/g, sender.name).replace(/{{recipientName}}/g, recipient.name);
        let body = confirmationEmailConfig.body.replace(/{{senderName}}/g, sender.name).replace(/{{recipientName}}/g, recipient.name);

        // Send the final confirmation email
        const confirmationMsg = {
            to: sender.email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: confirmationEmailConfig.senderName
            },
            subject: subject,
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>${confirmationEmailConfig.senderName}</h2>
                    <p>${body}</p>
                    <hr style="margin: 20px 0;"/>
                    <p>${confirmationEmailConfig.promoText}</p>
                    <a href="${confirmationEmailConfig.promoLinkURL}" target="_blank">
                        <img src="${confirmationEmailConfig.promoImageURL}" alt="Promo Image" style="max-width: 100%; width: 300px; margin-top: 10px; border-radius: 8px;">
                    </a>
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
        return response.status(500).send(`<h1>Error</h1><p>An unexpected error occurred during verification. ${error.message}</p>`);
    }
}

