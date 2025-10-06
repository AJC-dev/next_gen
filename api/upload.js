import { put } from '@vercel/blob';

// A helper function to convert the request stream into a Blob
async function streamToBlob(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return new Blob(chunks);
}

export default async function upload(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return new Response(JSON.stringify({ message: 'No filename provided.' }), { status: 400 });
  }
  if (!request.body) {
    return new Response(JSON.stringify({ message: 'No file body provided.' }), { status: 400 });
  }

  try {
    // Convert the incoming request stream into a complete Blob
    const fileBlob = await streamToBlob(request.body);

    console.log(`Uploading file: ${filename}, Size: ${fileBlob.size} bytes`);

    const blob = await put(filename, fileBlob, {
      access: 'public',
    });
    
    console.log('Upload successful:', blob);

    return new Response(JSON.stringify(blob), {
      status: 200,
    });
    
  } catch (error) {
    console.error('Error in upload function:', error);
    return new Response(JSON.stringify({ message: 'Error uploading file.', error: error.message }), {
      status: 500,
    });
  }
}

