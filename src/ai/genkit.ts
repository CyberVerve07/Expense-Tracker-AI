import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let aiInstance: Genkit;

function getAiInstance() {
  if (!aiInstance) {
    if (!process.env.GEMINI_API_KEY) {
      // This will happen on the server at runtime if the key is not set.
      // The build process might not have the key, which is fine now.
      console.error(
        'GEMINI_API_KEY environment variable not found. AI features will not work.'
      );
      // We can throw an error or return a mock/disabled instance
      throw new Error(
        'AI Service is not configured. GEMINI_API_KEY is missing.'
      );
    }

    aiInstance = genkit({
      plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
      model: 'googleai/gemini-2.5-flash',
    });
  }
  return aiInstance;
}

// Use a getter to export the lazily-initialized instance
export const ai = new Proxy({} as Genkit, {
  get: function (target, prop, receiver) {
    return Reflect.get(getAiInstance(), prop, receiver);
  },
});
