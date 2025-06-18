import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  universityId: z.string().min(3, { message: 'University ID is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  fullName: z.string().min(3, { message: 'Full name is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }),
  role: z.enum(['student', 'counselor'], { message: 'Please select a role.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], // path of error
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const AppointmentRequestSchema = z.object({
  counselorId: z.string().optional(), // Or make it required if student must select
  preferredDate: z.date({ required_error: 'Please select a date.' }),
  preferredTime: z.string().min(1, { message: 'Please select a time slot.' }),
  reason: z.string().min(10, { message: 'Please provide a brief reason (min 10 characters).' }).max(500),
  communicationMode: z.enum(['video', 'chat', 'in-person'], { message: 'Please select a communication mode.'}),
});

export type AppointmentRequestInput = z.infer<typeof AppointmentRequestSchema>;

export const SessionNotesSchema = z.object({
  sessionId: z.string(),
  notes: z.string().min(20, { message: 'Session notes must be at least 20 characters.' }),
  topicsDiscussed: z.array(z.string()).optional(),
  actionItems: z.array(z.string()).optional(),
});

export type SessionNotesInput = z.infer<typeof SessionNotesSchema>;

export const AiChatSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

export type AiChatInput = z.infer<typeof AiChatSchema>;

export const ProfileSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  email: z.string().email("Invalid email address."),
  universityId: z.string().min(1, "University ID is required."),
  phoneNumber: z.string().optional(),
  bio: z.string().max(200, "Bio can be at most 200 characters.").optional(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
