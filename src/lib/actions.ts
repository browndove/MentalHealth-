'use server';

import { studentTriageAssistant } from '@/ai/flows/student-triage-assistant';
import { SummarizeSessionNotesInput, summarizeSessionNotes } from '@/ai/flows/counselor-session-summary';
import { z } from 'zod';
import { AiChatSchema } from './schemas'; // SessionNotesSchema was not used here previously.
import { db } from './firebase';
import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, orderBy, getDoc } from 'firebase/firestore';
import { summarizeCallTranscript, type SummarizeCallTranscriptInput } from '@/ai/flows/call-transcript-summary';


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

export async function handleAiAssistantChat(input: {
  message: string;
  conversationId: string | null;
  userId: string;
}): Promise<{ answer: string; conversationId: string } | { error: string }> {
  try {
    const validatedInput = AiChatSchema.parse({ message: input.message });
     if (!input.userId) {
      return { error: 'User not authenticated.' };
    }

    let conversationId = input.conversationId;

    // If no conversationId, create a new one.
    if (!conversationId) {
      const newConversationRef = await addDoc(collection(db, 'ai_conversations'), {
        userId: input.userId,
        title: validatedInput.message.substring(0, 40) + (validatedInput.message.length > 40 ? '...' : ''),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messages: [],
      });
      conversationId = newConversationRef.id;
    }
    
    const conversationRef = doc(db, 'ai_conversations', conversationId);

    // Add user message to conversation
    await updateDoc(conversationRef, {
      messages: arrayUnion({
        id: Date.now().toString(),
        text: validatedInput.message,
        sender: 'user',
        createdAt: new Date().toISOString(),
      }),
      updatedAt: serverTimestamp(),
    });

    const result = await studentTriageAssistant({ question: validatedInput.message });
    if (!result.answer) {
        throw new Error('Failed to get response from AI assistant.');
    }

    // Add AI response to conversation
    await updateDoc(conversationRef, {
      messages: arrayUnion({
        id: (Date.now() + 1).toString(),
        text: result.answer,
        sender: 'ai',
        createdAt: new Date().toISOString(),
      }),
    });

    return { answer: result.answer, conversationId };

  } catch (error) {
     if (error instanceof z.ZodError) {
      return { error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('AI Assistant Error:', error);
    // Pass safe, specific errors to the frontend.
    if (error instanceof Error && error.message.includes("The AI model did not produce a valid output")) {
      return { error: error.message };
    }
    // For all other errors, use a generic message.
    return { error: 'An unexpected error occurred while communicating with the AI. Please try again.' };
  }
}

export async function getUserConversations(userId: string): Promise<{ id: string; title: string; updatedAt: any }[] | { error: string }> {
    if (!userId) return { error: "User not authenticated." };

    try {
        const q = query(collection(db, 'ai_conversations'), where('userId', '==', userId), orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const conversations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as { id: string; title: string; updatedAt: any }[];
        return conversations;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return { error: "Could not fetch conversations." };
    }
}

export async function getConversationMessages(conversationId: string, userId: string): Promise<{ messages: any[] } | { error: string }> {
    if (!userId) return { error: "User not authenticated." };

    try {
        const conversationRef = doc(db, 'ai_conversations', conversationId);
        const docSnap = await getDoc(conversationRef);

        if (!docSnap.exists() || docSnap.data().userId !== userId) {
            return { error: "Conversation not found or access denied." };
        }

        return { messages: docSnap.data().messages || [] };
    } catch (error) {
        console.error("Error fetching conversation messages:", error);
        return { error: "Could not fetch messages." };
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

export async function handleSummarizeCallTranscript(
  input: SummarizeCallTranscriptInput
): Promise<{ summary: string } | { error: string }> {
  try {
    // The Genkit flow already validates the input against its Zod schema.
    const result = await summarizeCallTranscript(input);
    return { summary: result.summary };
  } catch (error: any) {
    console.error('Call Transcript Summarization Error:', error);
    // Attempt to provide a more specific error message if it's a validation error from the flow.
    if (error.message && error.message.includes('Validation')) {
      return { error: 'The provided transcript is too short. Please provide at least 50 characters.' };
    }
    return { error: 'Failed to summarize the call transcript. Please try again.' };
  }
}