'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing counselor session notes.
 *
 * - summarizeSessionNotes - A function that takes session notes as input and returns a summarized version.
 * - SummarizeSessionNotesInput - The input type for the summarizeSessionNotes function.
 * - SummarizeSessionNotesOutput - The return type for the summarizeSessionNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSessionNotesInputSchema = z.object({
  sessionNotes: z
    .string()
    .describe('The session notes to be summarized.'),
});
export type SummarizeSessionNotesInput = z.infer<typeof SummarizeSessionNotesInputSchema>;

const SummarizeSessionNotesOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the session notes.'),
});
export type SummarizeSessionNotesOutput = z.infer<typeof SummarizeSessionNotesOutputSchema>;

export async function summarizeSessionNotes(input: SummarizeSessionNotesInput): Promise<SummarizeSessionNotesOutput> {
  return summarizeSessionNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSessionNotesPrompt',
  input: {schema: SummarizeSessionNotesInputSchema},
  output: {schema: SummarizeSessionNotesOutputSchema},
  prompt: `You are an experienced counselor. Please provide a concise summary of the following session notes, highlighting key discussion points and action items.\n\nSession Notes:\n{{{sessionNotes}}}`,
});

const summarizeSessionNotesFlow = ai.defineFlow(
  {
    name: 'summarizeSessionNotesFlow',
    inputSchema: SummarizeSessionNotesInputSchema,
    outputSchema: SummarizeSessionNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
