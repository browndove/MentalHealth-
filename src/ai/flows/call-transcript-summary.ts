
'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing call transcripts.
 *
 * - summarizeCallTranscript - A function that takes a call transcript as input and returns a summarized version.
 * - SummarizeCallTranscriptInput - The input type for the summarizeCallTranscript function.
 * - SummarizeCallTranscriptOutput - The return type for the summarizeCallTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCallTranscriptInputSchema = z.object({
  transcript: z
    .string()
    .min(50, { message: 'Transcript must be at least 50 characters long.' })
    .describe('The full text transcript of the call to be summarized.'),
});
export type SummarizeCallTranscriptInput = z.infer<typeof SummarizeCallTranscriptInputSchema>;

const SummarizeCallTranscriptOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the call transcript, highlighting key discussion points, decisions, and action items.'),
});
export type SummarizeCallTranscriptOutput = z.infer<typeof SummarizeCallTranscriptOutputSchema>;

export async function summarizeCallTranscript(input: SummarizeCallTranscriptInput): Promise<SummarizeCallTranscriptOutput> {
  return summarizeCallTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCallTranscriptPrompt',
  input: {schema: SummarizeCallTranscriptInputSchema},
  output: {schema: SummarizeCallTranscriptOutputSchema},
  prompt: `You are an expert meeting summarizer. Please provide a concise summary of the following call transcript. Focus on:
- Key topics discussed
- Important decisions made (if any)
- Action items assigned (if any)
- Overall sentiment or outcome if discernible

Format the summary clearly.

Transcript:
{{{transcript}}}`,
});

const summarizeCallTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeCallTranscriptFlow',
    inputSchema: SummarizeCallTranscriptInputSchema,
    outputSchema: SummarizeCallTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
