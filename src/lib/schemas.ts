
import { z } from 'zod';

// Schema for user login
export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});
export type LoginInput = z.infer<typeof LoginSchema>;


// Schema for user registration
export const RegisterSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  universityId: z.string().min(5, { message: 'A valid university ID is required.'}),
  role: z.enum(['student', 'counselor'], { required_error: 'You must select a role.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], // Set the error on the confirmPassword field
});
export type RegisterInput = z.infer<typeof RegisterSchema>;


// Schema for updating user profile
export const ProfileSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }).optional(),
  email: z.string().email().optional(), // Email is usually not editable
  universityId: z.string().optional(), // ID is usually not editable
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
});
export type ProfileInput = z.infer<typeof ProfileSchema>;

// Schema for requesting an appointment
export const RequestAppointmentSchema = z.object({
  counselorId: z.string().min(1, { message: "Please select a counselor." }),
  reason: z.string().min(10, { message: "Please provide a brief reason for your visit (min. 10 characters)."}).max(500),
  preferredDate: z.date({ required_error: "Please select a preferred date."}),
  preferredTime: z.string().min(1, { message: "Please select a preferred time."}),
  contactMethod: z.enum(['video', 'chat', 'in-person'], { required_error: "Please select a contact method."}),
});
export type RequestAppointmentInput = z.infer<typeof RequestAppointmentSchema>;
