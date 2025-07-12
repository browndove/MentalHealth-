import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyD5u39fF5iMYUT8EALc7QsPAi04KYSK6Rg',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
