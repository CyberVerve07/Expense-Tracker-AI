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

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // If the API key is not available, we log a clear warning and create a
    // "dummy" Genkit instance without the Google AI plugin. This prevents the
    // app from crashing and allows it to load. AI features will fail
    // gracefully when they are actually called.
    console.error(
      'FATAL: GEMINI_API_KEY environment variable not found at runtime. AI features will fail. Please check your deployment environment variables.'
    );
    aiInstance = genkit({ plugins: [] });
  } else {
    // If the API key IS available, create the full Genkit instance with the plugin.
    aiInstance = genkit({
      plugins: [googleAI({apiKey})],
      model: 'googleai/gemini-2.5-flash',
    });
  }

  return aiInstance;
}

// Use a Proxy to export the lazily-initialized instance. This is the key.
// Any access to `ai.someMethod()` will trigger the `get` handler,
// which then calls `getAiInstance()` to ensure Genkit is ready.
export const ai = new Proxy({} as Genkit, {
  get: function (target, prop, receiver) {
    // Forward the property access (e.g., `defineFlow`, `generate`) to the actual,
    // lazily-initialized Genkit instance.
    return Reflect.get(getAiInstance(), prop, receiver);
  },
});
