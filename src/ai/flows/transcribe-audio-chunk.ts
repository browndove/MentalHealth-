'use server';
/**
 * @fileOverview A Genkit flow for transcribing short audio chunks.
 *
 * - transcribeAudioChunk - A function that takes an audio data URI and returns the transcribed text.
 * - TranscribeAudioChunkInput - The input type for the function.
 * - TranscribeAudioChunkOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioChunkInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A chunk of audio to be transcribed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioChunkInput = z.infer<
  typeof TranscribeAudioChunkInputSchema
>;

const TranscribeAudioChunkOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioChunkOutput = z.infer<
  typeof TranscribeAudioChunkOutputSchema
>;

export async function transcribeAudioChunk(
  input: TranscribeAudioChunkInput
): Promise<TranscribeAudioChunkOutput> {
  return transcribeAudioChunkFlow(input);
}

const prompt = ai.definePrompt({
    name: 'transcribeAudioChunkPrompt',
    input: {schema: TranscribeAudioChunkInputSchema},
    output: {schema: TranscribeAudioChunkOutputSchema},
    prompt: `Transcribe the following audio recording. The audio is from a counseling session, so pay attention to clinical and emotional language.

Audio: {{media url=audioDataUri}}`,
});


const transcribeAudioChunkFlow = ai.defineFlow(
  {
    name: 'transcribeAudioChunkFlow',
    inputSchema: TranscribeAudioChunkInputSchema,
    outputSchema: TranscribeAudioChunkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
