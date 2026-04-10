'use server';

// TTS is not supported by Groq - returning a graceful stub.
// If TTS is needed, integrate ElevenLabs or a browser Web Speech API on the client side.

export async function textToSpeech(_query: string): Promise<{ media: string }> {
  // Groq does not support audio generation.
  // Return an empty media string so the app doesn't crash.
  console.warn('TTS is not available with the Groq backend. Skipping audio generation.');
  return { media: '' };
}
