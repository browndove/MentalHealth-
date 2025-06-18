'use server';

import { studentTriageAssistant, SummarizeSessionNotesInput, summarizeSessionNotes } from '@/ai/flows'; // Assuming correct paths
import { z } from 'zod';
import { AiChatSchema, SessionNotesSchema } from './schemas';

export async function handleAiAssistantChat(input: { message: string }): Promise<{ answer: string } | { error: string }> {
  try {
    const validatedInput = AiChatSchema.parse(input);
    const result = await studentTriageAssistant({ question: validatedInput.message });
    return { answer: result.answer };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('AI Assistant Error:', error);
    return { error: 'Failed to get response from AI assistant. Please try again.' };
  }
}

export async function handleSummarizeSessionNotes(
  input: SummarizeSessionNotesInput
): Promise<{ summary: string } | { error: string }> {
  try {
    // Basic validation, actual schema for this AI flow is internal to it.
    // For robustness, you might want to define a Zod schema here that matches SummarizeSessionNotesInput
    if (!input.sessionNotes || input.sessionNotes.length < 20) {
        return { error: "Session notes must be at least 20 characters long."};
    }
    const result = await summarizeSessionNotes({ sessionNotes: input.sessionNotes });
    return { summary: result.summary };
  } catch (error) {
    console.error('Session Notes Summarization Error:', error);
    return { error: 'Failed to summarize session notes. Please try again.' };
  }
}
