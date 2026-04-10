import Groq from 'groq-sdk';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
  if (groqInstance) return groqInstance;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set. Please add it to your .env file.');
  }
  groqInstance = new Groq({ apiKey });
  return groqInstance;
}

export { getGroqClient };
