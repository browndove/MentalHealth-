'use server';
/**
 * @fileOverview A Genkit flow for sending meeting reminder emails.
 *
 * This flow is designed to be triggered by a scheduled task (e.g., a cron job).
 * It simulates sending an email reminder to a participant for an upcoming session.
 *
 * - sendMeetingReminderEmail - A function that takes recipient and meeting details and simulates sending an email.
 * - MeetingReminderInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const MeetingReminderInputSchema = z.object({
  recipientEmail: z.string().email().describe('The email address of the recipient.'),
  recipientName: z.string().describe('The name of the recipient.'),
  meetingTime: z.string().describe('The scheduled time of the meeting (e.g., "10:00 AM on August 15, 2024").'),
  meetingLink: z.string().url().describe('The unique URL for joining the video call.'),
  userRole: z.enum(['student', 'counselor']).describe('The role of the recipient.'),
});

export type MeetingReminderInput = z.infer<typeof MeetingReminderInputSchema>;

// This function simulates sending an email. In a real application, you would
// integrate a third-party email service like SendGrid, Mailgun, or Nodemailer here.
async function sendEmail(input: { to: string; subject: string; body: string }) {
  console.log('--- SIMULATING EMAIL SEND ---');
  console.log(`To: ${input.to}`);
  console.log(`Subject: ${input.subject}`);
  console.log('Body:\n' + input.body);
  console.log('-----------------------------');
  // In a real implementation, this would return a promise from your email provider API.
  return Promise.resolve({ success: true });
}


export const sendMeetingReminderEmailFlow = ai.defineFlow(
  {
    name: 'sendMeetingReminderEmailFlow',
    inputSchema: MeetingReminderInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    const subject = `Reminder: Your Accra TechMind Session is Starting Soon`;
    
    const body = `
Dear ${input.recipientName},

This is a reminder that your scheduled session with Accra TechMind is about to begin.

Time: ${input.meetingTime}
Role: ${input.userRole}

Please use the link below to join the video call:
${input.meetingLink}

If you have any issues, please contact support.

Sincerely,
The Accra TechMind Team
`;

    const result = await sendEmail({
      to: input.recipientEmail,
      subject,
      body,
    });

    return { success: result.success };
  }
);

// Export a wrapper function for easier invocation from other parts of the app.
export async function sendMeetingReminderEmail(input: MeetingReminderInput): Promise<{ success: boolean }> {
  return sendMeetingReminderEmailFlow(input);
}
