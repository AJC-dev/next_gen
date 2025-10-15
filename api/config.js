// Vercel Serverless Function
// This function runs on the server and reads your environment variables.
// It keeps your secret keys from being exposed in the public front-end code.

export default function handler(request, response) {
  try {
    const config = {
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      pixabayApiKey: process.env.PIXABAY_API_KEY,
    };

    // Basic validation to ensure variables are set in Vercel
    if (!config.recaptchaSiteKey || !config.pixabayApiKey) {
      console.error("Missing environment variables on the server.");
      return response.status(500).json({ error: "Server configuration error." });
    }

    response.status(200).json(config);
  } catch (error) {
    console.error("Error in /api/config:", error);
    response.status(500).json({ error: "Internal Server Error." });
  }
}
