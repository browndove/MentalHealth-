'use server';

import { studentTriageAssistant } from '@/ai/flows/student-triage-assistant';
import { SummarizeSessionNotesInput, summarizeSessionNotes } from '@/ai/flows/counselor-session-summary';
import { z } from 'zod';
import { AiChatSchema } from './schemas'; // SessionNotesSchema was not used here previously.
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';


export async function getCounselors(): Promise<{ id: string; name: string }[]> {
  try {
    const counselorsQuery = query(collection(db, 'users'), where('role', '==', 'counselor'));
    const querySnapshot = await getDocs(counselorsQuery);
    const counselors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().fullName || 'Unnamed Counselor',
    }));
    return counselors;
  } catch (error) {
    console.error("Error fetching counselors: ", error);
    return []; // Return empty array on error to prevent crashes
  }
}

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
