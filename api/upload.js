import { put } from '@vercel/blob';

// Helper function to stream request body to a buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function upload(request, response) {
  try {
    // Construct the full URL from Vercel's request headers
    const proto = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers['x-forwarded-host'] || request.headers.host;
    const fullUrl = new URL(request.url, `${proto}://${host}`);
    
    // Now, safely parse the filename from the full URL
    const filename = fullUrl.searchParams.get('filename');

    if (!filename) {
      return response.status(400).json({ error: "Missing 'filename' query parameter." });
    }

    // Convert the streamed request body into a Buffer.
    const fileBuffer = await streamToBuffer(request.body);

    // Upload the file to Vercel Blob storage.
    const blob = await put(filename, fileBuffer, {
      access: 'public',
    });

    // Respond with the blob's URL.
    return response.status(200).json(blob);

  } catch (error) {
    console.error('Upload failed:', error);
    return response.status(500).json({ error: 'Failed to upload file.', details: error.message });
  }
}

