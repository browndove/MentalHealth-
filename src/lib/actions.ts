
'use server';

import { studentTriageAssistant } from '@/ai/flows/student-triage-assistant';
import { SummarizeSessionNotesInput, summarizeSessionNotes } from '@/ai/flows/counselor-session-summary';
import { z } from 'zod';
import { AppointmentRequestSchema, type AppointmentRequestInput, AiChatSchema } from './schemas';
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
  Timestamp,
  documentId
} from 'firebase/firestore';
import { summarizeCallTranscript, type SummarizeCallTranscriptInput } from '@/ai/flows/call-transcript-summary';
import { transcribeAudioChunk as transcribeAudioChunkFlow, type TranscribeAudioChunkInput } from '@/ai/flows/transcribe-audio-chunk';
import { format } from 'date-fns';

export async function transcribeAudioChunk(input: TranscribeAudioChunkInput) {
    try {
        const result = await transcribeAudioChunkFlow(input);
        return result;
    } catch (e: any) {
        console.error("Transcription flow error", e);
        return { transcription: "" }; // Return empty on error to avoid breaking client
    }
}

export async function getCounselors(userId: string): Promise<{ data: { id: string; name: string, specialties: string[] }[] } | { error: string }> {
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
      specialties: doc.data().specializations || [],
      avatarUrl: doc.data().avatarUrl
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

export async function getCounselorAppointments(counselorId: string) {
    if (!counselorId) return { error: 'A counselor ID is required.' };
    
    try {
        const db = getDbInstance();
        const q = query(collection(db, 'appointments'), where('counselorId', '==', counselorId));
        const querySnapshot = await getDocs(q);
        
        const appointments = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const dateVal = data.date?.toDate ? data.date.toDate() : new Date(data.date);
            return {
                id: doc.id, 
                ...data,
                date: format(dateVal, 'yyyy-MM-dd'),
                sortableDate: dateVal.getTime(),
            }
        });
        
        appointments.sort((a, b) => b.sortableDate - a.sortableDate);
        
        return { data: appointments };
    } catch (error: any) {
        console.error("Error fetching counselor appointments:", error);
        return { error: "Could not fetch appointments. This might be a permission issue or an unexpected problem. Please check server logs." };
    }
}


export async function getAssignedStudents(counselorId: string) {
    if (!counselorId) return { error: 'A counselor ID is required.' };
    
    try {
        const db = getDbInstance();
        // Step 1: Get all appointments for the counselor
        const appointmentsQuery = query(collection(db, 'appointments'), where('counselorId', '==', counselorId));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        if (appointmentsSnapshot.empty) {
            return { data: [] };
        }
        
        const allAppointments = appointmentsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
            }
        });

        const studentIds = [...new Set(allAppointments.map(doc => doc.studentId))];

        if (studentIds.length === 0) {
            return { data: [] };
        }
        
        // Step 2: Fetch the user documents for these students
        const studentsQuery = query(collection(db, 'users'), where(documentId(), 'in', studentIds));
        const studentsSnapshot = await getDocs(studentsQuery);
        
        // Step 3: Process and enrich student data with session info
        const students = studentsSnapshot.docs.map(doc => {
             const studentData = doc.data();
             const studentId = doc.id;
             
             // Filter appointments for the current student
             const studentAppointments = allAppointments.filter(a => a.studentId === studentId);
             
             const now = new Date();
             const upcomingSessions = studentAppointments
                .filter(a => a.date && new Date(a.date) >= now && a.status === 'Confirmed')
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

             const pastSessions = studentAppointments
                .filter(a => a.date && new Date(a.date) < now && a.status === 'Completed')
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

             return {
                id: studentId,
                name: studentData.fullName,
                universityId: studentData.universityId,
                avatarUrl: studentData.avatarUrl || `https://placehold.co/64x64.png`,
                aiHint: studentData.aiHint || 'student photo',
                lastSession: pastSessions.length > 0 ? pastSessions[0].date : undefined,
                nextSession: upcomingSessions.length > 0 ? upcomingSessions[0].date : undefined,
             }
        });

        return { data: students };
    } catch (error: any) {
        console.error("Error fetching assigned students:", error);
        return { error: "Could not fetch assigned students. This might be a permission issue or a missing Firestore index. Please check server logs." };
    }
}

export async function updateAppointmentStatus(appointmentId: string, status: 'Confirmed' | 'Cancelled') {
    if (!appointmentId) return { error: 'Appointment ID is required.' };
    try {
        const db = getDbInstance();
        const appointmentRef = doc(db, 'appointments', appointmentId);
        await updateDoc(appointmentRef, { status: status });
        return { success: true };
    } catch (error: any) {
        console.error(`Error updating appointment ${appointmentId} to ${status}:`, error);
        return { error: `Failed to update appointment status.` };
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
    let counselorId: string | null = null;

    if(validatedInput.preferredCounselorId && validatedInput.preferredCounselorId !== 'no-preference') {
        counselorId = validatedInput.preferredCounselorId;
    } else {
        const counselorsResult = await getCounselors(userId);
        if('data' in counselorsResult && counselorsResult.data.length > 0) {
          counselorId = counselorsResult.data[Math.floor(Math.random() * counselorsResult.data.length)].id;
        } else {
          return { error: "No counselors are available at this time. Please try again later." };
        }
    }
    
    const communicationTypeMap: { [key: string]: 'video' | 'chat' | 'in-person' } = {
        'Video Call': 'video',
        'Chat': 'chat',
        'In-Person': 'in-person'
    };
    
    const appointmentData = {
      studentId: userId,
      studentName: studentName,
      counselorId: counselorId,
      date: validatedInput.preferredDate,
      time: validatedInput.preferredTimeSlot,
      reasonPreview: validatedInput.reasonForAppointment.substring(0, 100) + '...',
      reasonForAppointment: validatedInput.reasonForAppointment,
      status: 'Pending',
      communicationMode: communicationTypeMap[validatedInput.sessionType],
      type: validatedInput.sessionType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastContact: new Date().toISOString(),
      sessionNumber: null,
      duration: validatedInput.duration,
      notesAvailable: false,
    };

    await addDoc(collection(db, 'appointments'), appointmentData);

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

export async function getStudentSessions(userId: string, isCounselor: boolean = false): Promise<{ data: any[] } | { error: string }> {
  let fieldToQuery: 'studentId' | 'counselorId';

  if (!userId) {
    return { error: 'Authentication required.' };
  }
  
  try {
    fieldToQuery = isCounselor ? 'counselorId' : 'studentId';

    const db = getDbInstance();
    const q = query(
      collection(db, 'appointments'),
      where(fieldToQuery, '==', userId),
      // orderBy('date', 'desc') // This requires a composite index. Remove for now.
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const dateVal = data.date?.toDate ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
      return {
        id: doc.id,
        ...data,
        date: dateVal, // Keep as Date object for sorting
      };
    });
    
    // Sort in code to avoid needing a composite index
    sessions.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Now format the date to a string after sorting
    const formattedSessions = sessions.map(session => ({
        ...session,
        date: session.date.toISOString().split('T')[0],
    }));
    
    return { data: formattedSessions };
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    if (error.code === 'failed-precondition') {
      const definedFieldToQuery = isCounselor ? 'counselorId' : 'studentId';
      return { error: `Query failed. This is likely due to a missing Firestore index. Please check server logs for a link to create the required index on the 'appointments' collection for the '${definedFieldToQuery}' and 'date' fields.` };
    }
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

    await updateDoc(conversationRef, updates, { merge: true });

    const result = await studentTriageAssistant({ question: validatedInput.message });
    if (!result.answer) {
        throw new Error('Failed to get response from AI assistant.');
    }

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
        // The query is simplified to only filter by userId, avoiding the need for a composite index.
        const q = query(collection(db, 'conversations'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const conversations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || 'Untitled Chat',
                // Keep the timestamp object for sorting
                updatedAt: data.updatedAt,
            };
        });

        // Sort the conversations in code instead of in the query
        conversations.sort((a, b) => {
            const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(0);
            const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        return { data: conversations };
    } catch (error: any) {
        console.error("Error fetching conversations:", error);
         if (error.code === 'failed-precondition') {
            // This error message is now less likely to be triggered, but is kept for safety.
            return { error: "Query failed due to missing Firestore index. Check server logs for a link to create it." };
         }
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


    


      