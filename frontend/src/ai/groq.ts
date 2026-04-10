import Groq from 'groq-sdk';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
  if (groqInstance) return groqInstance;

  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Sorry service not available.');
  }
  groqInstance = new Groq({ apiKey });
  return groqInstance;
}

export { getGroqClient };
