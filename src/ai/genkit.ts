/**
 * @fileoverview This file initializes the Genkit framework and configures plugins.
 * It exports a single `ai` object that is used to define flows, prompts, and models.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  // Set to true to see telemetry data in the Genkit developer UI.
  enableTracingAndMetrics: true,
});
