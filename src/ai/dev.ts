
import { config } from 'dotenv';
config();

import '@/ai/flows/counselor-session-summary.ts';
import '@/ai/flows/student-triage-assistant.ts';
import '@/ai/flows/call-transcript-summary.ts';
import '@/ai/flows/transcribe-audio-chunk.ts'; // Added new flow
