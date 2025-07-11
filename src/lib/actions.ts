
'use server';

import { studentTriageAssistant } from '@/ai/flows/student-triage-assistant';
import { SummarizeSessionNotesInput, summarizeSessionNotes } from '@/ai/flows/counselor-session-summary';
import { z } from 'zod';
import { AiChatSchema, AppointmentRequestSchema, type AppointmentRequestInput } from './schemas';
import { getDbInstance } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion, 
  orderBy, 
  getDoc, 
  where,
  Timestamp
} from 'firebase/firestore';
import { summarizeCallTranscript, type SummarizeCallTranscriptInput } from '@/ai/flows/call-transcript-summary';
import { transcribeAudioChunk as transcribeAudioChunkFlow, type TranscribeAudioChunkInput } from '@/ai/flows/transcribe-audio-chunk';

export async function transcribeAudioChunk(input: TranscribeAudioChunkInput) {
    try {
        const result = await transcribeAudioChunkFlow(input);
        return result;
    } catch (e: any) {
        console.error("Transcription flow error", e);
        return { transcription: "" }; // Return empty on error to avoid breaking client
    }
}

export async function getCounselors(userId: string): Promise<{ data: { id: string; name: string }[] } | { error: string }> {
  if (!userId) {
    return { error: "Action requires an authenticated user." };
  }
  
  try {
    const db = getDbInstance();
    const q = query(collection(db, 'users'), where('role', '==', 'counselor'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { data: [] };
    }

    const counselors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().fullName || 'Unnamed Counselor',
    }));
    
    return { data: counselors };
  } catch (error: any) {
    console.error("Error fetching counselors: ", error);
    if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        const errorMessage = `CRITICAL: The query to find counselors was blocked. This is almost always caused by a **MISSING FIRESTORE INDEX**, not your security rules.

**ACTION REQUIRED:**
1. Open your Firebase Studio **Server Logs**.
2. Look for an error message that contains a long URL. This is a link to create the required index.
3. Click that link. It will take you to your Firebase Console.
4. Click the "Create Index" button in the Firebase Console.
5. Wait a few minutes for the index to build, then refresh the app.

The required index is on the 'users' collection for the 'role' field. This is a one-time setup.`;
        return { error: errorMessage };
    }
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

export async function requestAppointment(
  input: AppointmentRequestInput,
  userId: string,
  studentName: string | null
): Promise<{ success: boolean } | { error: string }> {
  try {
    const validatedInput = AppointmentRequestSchema.parse(input);

    if (!userId || !studentName) {
      return { error: 'You must be logged in to request an appointment.' };
    }
    
    const db = getDbInstance();
    let counselorName: string | null = null;
    if(validatedInput.counselorId) {
        const counselorDoc = await getDoc(doc(db, 'users', validatedInput.counselorId));
        if(counselorDoc.exists()) {
            counselorName = counselorDoc.data().fullName;
        }
    }

    // Convert JavaScript Date to Firestore Timestamp
    const firestoreDate = validatedInput.preferredDate ? Timestamp.fromDate(validatedInput.preferredDate) : null;

    await addDoc(collection(db, 'appointments'), {
      studentId: userId,
      studentName: studentName,
      counselorId: validatedInput.counselorId || null,
      counselorName: counselorName,
      preferredDate: firestoreDate,
      preferredTime: validatedInput.preferredTime,
      communicationMode: validatedInput.communicationMode,
      reason: validatedInput.reason,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Appointment Request Error:', error);
    if (error instanceof Error) {
        if (error.message.includes('permission-denied') || error.message.includes('PERMISSION_DENIED')) {
            const rulesError = `Permission Denied: Your security rules are blocking the creation of appointments. Please ensure your firestore.rules file allows students to create documents in the 'appointments' collection. 
            
A rule like this is needed:
match /appointments/{appointmentId} { 
  allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid; 
}`;
            return { error: rulesError };
        }
        return { error: error.message };
    }
    return { error: 'An unexpected error occurred while submitting your request.' };
  }
}

export async function getStudentSessions(userId: string): Promise<{ data: any[] } | { error: string }> {
  if (!userId) {
    return { error: 'Authentication required.' };
  }

  try {
    const db = getDbInstance();
    // Query without ordering to avoid needing a composite index.
    const q = query(
      collection(db, 'appointments'),
      where('studentId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore timestamps need to be converted to a serializable format
      const dateValue = data.preferredDate?.toDate ? data.preferredDate.toDate() : new Date();
      const createdAtValue = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

      return {
        id: doc.id,
        ...data,
        date: dateValue.toISOString(),
        createdAt: createdAtValue.getTime(), // Get epoch time for sorting
        time: data.preferredTime,
        counselor: data.counselorName || 'Not Assigned',
        type: data.communicationMode.charAt(0).toUpperCase() + data.communicationMode.slice(1) + ' Session',
        notesAvailable: data.status === 'completed', // Example logic
        summary: data.summary || null, // Assuming summary might be added later
        status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
      };
    });
    
    // Sort the results in code instead of in the query
    sessions.sort((a, b) => b.createdAt - a.createdAt);

    return { data: sessions };
  } catch (error: any) {
    console.error('Error fetching student sessions:', error);
     // This simplified error is now sufficient
    return { error: `An unexpected error occurred while fetching your sessions: ${error.message}` };
  }
}


export async function handleAiAssistantChat(input: {
  message: string;
  conversationId: string | null;
  userId: string;
  userName: string;
}): Promise<{ answer: string; conversationId: string } | { error: string }> {
  try {
    const validatedInput = AiChatSchema.parse({ message: input.message });
     if (!input.userId || !input.userName) {
      return { error: 'User not authenticated or user name is missing.' };
    }

    const db = getDbInstance();
    let conversationId = input.conversationId;
    
    // If no conversationId, create a new one.
    if (!conversationId) {
      const newConversationRef = await addDoc(collection(db, 'conversations'), {
        userId: input.userId,
        userName: input.userName,
        title: validatedInput.message.substring(0, 40) + (validatedInput.message.length > 40 ? '...' : ''),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messages: [],
      });
      conversationId = newConversationRef.id;
    }
    
    const conversationRef = doc(db, 'conversations', conversationId);
    
    const updates: { [key: string]: any } = {};
    updates.updatedAt = serverTimestamp();
    updates.messages = arrayUnion({
        id: Date.now().toString(),
        text: validatedInput.message,
        sender: 'user',
        createdAt: new Date().toISOString(),
      });

    // For existing conversations, check if fields are missing and add them.
    const docSnap = await getDoc(conversationRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.title) {
            updates.title = validatedInput.message.substring(0, 40) + (validatedInput.message.length > 40 ? '...' : '');
        }
        if (!data.userId) {
            updates.userId = input.userId;
        }
        if (!data.userName) {
            updates.userName = input.userName;
        }
    }


    // Apply all updates in one go
    await updateDoc(conversationRef, updates, { merge: true });

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

export async function getUserConversations(userId: string): Promise<{ data?: { id: string; title: string; updatedAt: any }[], error?: string }> {
    if (!userId) return { error: "User not authenticated." };

    try {
        const db = getDbInstance();
        // More robust query without orderBy to avoid needing a composite index
        const q = query(collection(db, 'conversations'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const conversations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || 'Untitled Chat',
                updatedAt: data.updatedAt, // Keep as Timestamp for sorting
            };
        });

        // Sort in code instead of in the query
        conversations.sort((a, b) => {
            const timeA = a.updatedAt?.toMillis() || 0;
            const timeB = b.updatedAt?.toMillis() || 0;
            return timeB - timeA;
        });

        return { data: conversations };
    } catch (error: any) {
        console.error("Error fetching conversations:", error);
         // Return a generic error to the client, but log the specific one on the server
        return { error: "An unexpected error occurred while fetching your past conversations." };
    }
}

export async function getConversationMessages(conversationId: string, userId: string): Promise<{ messages: any[] } | { error: string }> {
    if (!userId) return { error: "User not authenticated." };

    try {
        const db = getDbInstance();
        const conversationRef = doc(db, 'conversations', conversationId);
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
