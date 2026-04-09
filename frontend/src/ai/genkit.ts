import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Store a singleton instance.
let aiInstance: Genkit;

/**
 * Lazily initializes and returns the Genkit AI instance.
 * This ensures that Genkit is only configured when it's first needed
 * and that environment variables are available at runtime.
 */
function getAiInstance() {
  // If the instance already exists, return it.
  if (aiInstance) {
    return aiInstance;
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      'WARNING: GEMINI_API_KEY not found. AI features will fail gracefully.'
    );
    aiInstance = genkit({ plugins: [] });
  } else {
    aiInstance = genkit({
      plugins: [googleAI({apiKey})],
      model: 'googleai/gemini-2.0-flash',
    });
  }

  return aiInstance;
}

export const ai = new Proxy({} as Genkit, {
  get: function (target, prop, receiver) {
    return Reflect.get(getAiInstance(), prop, receiver);
  },
});
