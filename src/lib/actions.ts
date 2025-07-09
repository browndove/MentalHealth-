
'use server';

import { studentTriageAssistant } from '@/ai/flows/student-triage-assistant';
import { SummarizeSessionNotesInput, summarizeSessionNotes } from '@/ai/flows/counselor-session-summary';
import { z } from 'zod';
import { AiChatSchema } from './schemas';
import { db } from './firebase';
import { collection, getDocs, query, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, orderBy, getDoc, where } from 'firebase/firestore';
import { summarizeCallTranscript, type SummarizeCallTranscriptInput } from '@/ai/flows/call-transcript-summary';

export async function getCounselors(userId: string): Promise<{ id: string; name: string }[] | { error: string }> {
  if (!userId) {
    return { error: 'Authentication failed. You must be logged in to view counselors.' };
  }
  
  try {
    // --- TEMPORARY DEBUGGING STEP ---
    // Instead of querying with a "where" clause (which requires an index),
    // we fetch all users and filter in the code. This helps determine if the
    // issue is a basic read permission or a missing Firestore Index.
    console.log("DEBUG: Fetching all users to manually filter for counselors...");
    const usersCollectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);

    const counselors = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName,
          role: data.role,
        };
      })
      .filter(user => user.role === 'counselor')
      .map(counselor => ({
        id: counselor.id,
        name: counselor.fullName || 'Unnamed Counselor',
      }));
    
    console.log(`DEBUG: Found ${counselors.length} counselors out of ${querySnapshot.docs.length} total users.`);

    if (counselors.length === 0 && querySnapshot.docs.length > 0) {
        console.log("DEBUG: No documents with role='counselor' found in the 'users' collection.");
    }
    
    return counselors;

  } catch (error: any) {
    console.error("Error fetching users collection: ", error);

    // Specific check for a missing index error
    if (error.code === 'failed-precondition') {
      const errorMessage = "CRITICAL: Firestore Index Required. The query to find counselors was blocked because a database index is missing. In your Firebase Console, go to the Firestore section. You should see an error message with a link to create the required index for the 'users' collection on the 'role' field. This is a one-time setup step that can take a few minutes to complete after you click the create button.";
      return { error: errorMessage };
    }
    
    if (error.code === 'permission-denied') {
      const errorMessage = "CRITICAL: Firestore Permission Denied. Your security rules are blocking this query. Please go to the Firestore 'Rules' tab in your Firebase Console and ensure you have a rule like: 'match /users/{userId} { allow read: if request.auth != null; }'.";
      return { error: errorMessage };
    }
    
    return { error: `An unexpected server error occurred: ${error.message}` };
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
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'An unexpected error occurred while communicating with the AI. Please try again.' };
  }
}

export async function getUserConversations(userId: string): Promise<{ id: string; title: string; updatedAt: any }[] | { error:string }> {
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
    const result = await summarizeCallTranscript(input);
    return { summary: result.summary };
  } catch (error: any) {
    console.error('Call Transcript Summarization Error:', error);
    if (error.message && error.message.includes('Validation')) {
      return { error: 'The provided transcript is too short. Please provide at least 50 characters.' };
    }
    return { error: 'Failed to summarize the call transcript. Please try again.' };
  }
}
