import { put } from '@vercel/blob';

export default async function upload(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return new Response(JSON.stringify({ message: 'No filename or file body provided.' }), {
      status: 400,
    });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
    });
    
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return new Response(JSON.stringify({ message: 'Error uploading file.', error: error.message }), {
      status: 500,
    });
  }
}

