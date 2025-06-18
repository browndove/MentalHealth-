// 'use server'
'use server';

/**
 * @fileOverview Provides an AI assistant to triage student inquiries and provide access to FAQs and self-help information.
 *
 * - `studentTriageAssistant`: A function that processes student questions and returns helpful information.
 * - `StudentTriageAssistantInput`: The input type for the `studentTriageAssistant` function.
 * - `StudentTriageAssistantOutput`: The return type for the `studentTriageAssistant` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentTriageAssistantInputSchema = z.object({
  question: z
    .string()
    .describe('The question from the student seeking mental health resources, FAQs, or self-help information.'),
});
export type StudentTriageAssistantInput = z.infer<typeof StudentTriageAssistantInputSchema>;

const StudentTriageAssistantOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the student question, providing relevant mental health resources, FAQs, or self-help information.'),
});
export type StudentTriageAssistantOutput = z.infer<typeof StudentTriageAssistantOutputSchema>;

export async function studentTriageAssistant(
  input: StudentTriageAssistantInput
): Promise<StudentTriageAssistantOutput> {
  return studentTriageAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentTriageAssistantPrompt',
  input: {schema: StudentTriageAssistantInputSchema},
  output: {schema: StudentTriageAssistantOutputSchema},
  prompt: `You are a helpful AI assistant providing mental health resources, FAQs, and self-help information to students at Accra Technical University.

  Answer the following question clearly and concisely:

  Question: {{{question}}}
  `,
});

const studentTriageAssistantFlow = ai.defineFlow(
  {
    name: 'studentTriageAssistantFlow',
    inputSchema: StudentTriageAssistantInputSchema,
    outputSchema: StudentTriageAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
