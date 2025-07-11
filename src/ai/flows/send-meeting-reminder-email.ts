'use server';
/**
 * @fileOverview A Genkit flow for sending meeting reminder emails using Resend.
 *
 * This flow is designed to be triggered by a scheduled task (e.g., a cron job).
 * It sends a formatted HTML email reminder to a participant for an upcoming session.
 *
 * - sendMeetingReminderEmail - A function that takes recipient and meeting details and sends an email.
 * - MeetingReminderInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

export const MeetingReminderInputSchema = z.object({
  recipientEmail: z.string().email().describe('The email address of the recipient.'),
  recipientName: z.string().describe('The name of the recipient.'),
  meetingTime: z.string().describe('The scheduled time of the meeting (e.g., "10:00 AM on August 15, 2024").'),
  meetingLink: z.string().url().describe('The unique URL for joining the video call.'),
  userRole: z.enum(['student', 'counselor']).describe('The role of the recipient.'),
});

export type MeetingReminderInput = z.infer<typeof MeetingReminderInputSchema>;


/**
 * Creates a visually appealing HTML email template for the reminder.
 * @param input The meeting reminder details.
 * @returns An HTML string.
 */
function createEmailHtml(input: MeetingReminderInput): string {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 12px; overflow: hidden; }
  .header { background-color: #0d6efd; color: white; padding: 40px; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; }
  .content { padding: 30px 40px; color: #343a40; line-height: 1.6; }
  .content p { margin: 0 0 1em; }
  .info-box { background-color: #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
  .info-box strong { display: block; margin-bottom: 8px; color: #495057; }
  .button-container { text-align: center; margin-top: 30px; }
  .button { background-color: #0d6efd; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
  .footer { background-color: #f1f3f5; padding: 20px 40px; text-align: center; font-size: 12px; color: #6c757d; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Session Reminder</h1>
    </div>
    <div class="content">
      <p>Dear ${input.recipientName},</p>
      <p>This is a friendly reminder that your scheduled session with Accra TechMind is about to begin.</p>
      <div class="info-box">
        <strong>Time:</strong> ${input.meetingTime}<br>
        <strong>Your Role:</strong> ${input.userRole.charAt(0).toUpperCase() + input.userRole.slice(1)}
      </div>
      <div class="button-container">
        <a href="${input.meetingLink}" class="button">Join Session Now</a>
      </div>
      <p style="margin-top: 30px;">If you have any issues joining, please contact support.</p>
      <p>Sincerely,<br>The Accra TechMind Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Accra TechMind. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
}


export const sendMeetingReminderEmailFlow = ai.defineFlow(
  {
    name: 'sendMeetingReminderEmailFlow',
    inputSchema: MeetingReminderInputSchema,
    outputSchema: z.object({ success: z.boolean(), messageId: z.string().optional() }),
  },
  async (input) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Resend API key is not configured. Set RESEND_API_KEY in your .env file.");
      throw new Error("Email service is not configured.");
    }
    const resend = new Resend(apiKey);
    
    const subject = `Reminder: Your Accra TechMind Session is Starting Soon`;
    const htmlBody = createEmailHtml(input);

    try {
      const { data, error } = await resend.emails.send({
        from: 'Accra TechMind <notifications@resend.dev>', // Replace with your verified sender domain
        to: [input.recipientEmail],
        subject: subject,
        html: htmlBody,
      });

      if (error) {
        console.error("Resend API Error:", error);
        throw new Error(error.message);
      }
      
      console.log("Email sent successfully, Message ID:", data?.id);
      return { success: true, messageId: data?.id };

    } catch (e: any) {
        console.error("Failed to send email via Resend:", e);
        // We re-throw so the caller knows the operation failed.
        // Genkit will handle catching this and returning an error state.
        throw e;
    }
  }
);

// Export a wrapper function for easier invocation from other parts of the app.
export async function sendMeetingReminderEmail(input: MeetingReminderInput): Promise<{ success: boolean; messageId?: string } | { success: false; error: string }> {
  try {
    const result = await sendMeetingReminderEmailFlow(input);
    return { success: true, messageId: result.messageId };
  } catch(e: any) {
    return { success: false, error: e.message || 'An unknown error occurred while sending the email.' };
  }
}
